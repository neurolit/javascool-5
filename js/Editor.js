// On ajoute les variables javascool si le document est en StandAlone
if (javascool == undefined) {
    javascool = {};
}

/**
 * @class
 */
javascool.Editor = function () {
    /**
     * @type {javascool.Editor}
     */
    var that = this;

    /**
     * Le fichier en cours d'édition dans cette instance de cet éditeur.
     * @type  {javascool.File}
     */
    var file = null;

    /**
     * L'id de la div html alloué à l'éditeur.
     */
    var htmlID = "";

    /**
     * L'instance de CodeMirror.
     * @type {CodeMirror}
     */
    var editor = null;
    /**
     * Création et de mise en place de l'éditeur
     * @param {javascool.File} fileObject Le fichier à éditer
     * @param {String} DivID L'ID de la div HTML allouée
     */
    this.setup = function (fileObject, DivID) {
        // On assigne les valeurs
        file = fileObject;
        htmlID = DivID;
        javascool.debug(htmlID)

        setup();
    };

    function setTitle(title) {
        $("#" + htmlID).trigger("setTitle", title);
    }

    /**
     * Met en place l'éditeur une fois les varibles paramettrés
     */
    function setup() {
        installFileListeners();
        installEditorOnID(htmlID)
        installEditorListeners();
    }

    /**
     * Installe les ecouteurs sur le fichier.
     */
    function installFileListeners() {
        file.$.bind(file.events.NAME_UPDATE, function () {
            setTitle(file.name)
        });
    }


    /**
     * Installe les ecouteurs sur l'Editeur pour le redimentionnement.
     */
    function installEditorListeners() {
        if ($("#" + htmlID).parent().is(".tab-content")) {
            $("#" + htmlID).bind("visible", function () {
                resizer();
                editor.refresh();
            });
            var resizer = function () {
                var availibleHeight = parseInt(javascool.EditorTabsManager.tabs.$.innerHeight() - parseInt(javascool.EditorTabsManager.tabs.$.children(".nav").outerHeight()));
                $(editor.getScrollerElement()).height(availibleHeight - 1);
                editor.refresh();
            };
            $(window).bind("resize", resizer);
            resizer();
        }
        editor.refresh();
        editor.focus();
    }

    /**
     * Met en place CodeMirror sur l'ID specifié
     */
    function installEditorOnID() {
        editor = CodeMirror(document.getElementById(htmlID), {
            value:file.content,
            mode:"text/x-javascool",
            theme:"eclipse",
            lineNumbers:true,
            fixedGutter:true,
            gutter:true,
            onChange:function (editor) {
                file.content = editor.getValue();
            },
            extraKeys: {
                "Ctrl-B": function(){
                    editor.autoFormatRange({ch:0,line:0},{ch:0,line:editor.lineCount()});
                },
                "Ctrl-S":function(){
                    file.save();
                },
                "Maj-Ctrl-S":function(){
                    file.saveAs();
                },
                "Ctrl-Space": function(){
                    CodeMirror.simpleHint(editor, CodeMirror.javascriptHint);
                }
            }
        });
    }

    this.getText = function () {
        return editor.getValue();
    };
    /**
     * @return {javascool.File}
     */
    this.getFile = function () {
        return file;
    };
    /**
     * @return {CodeMirror}
     */
    this.getEditor = function () {
        return editor;
    };

    /**
     * Permet de restaurer l'état du composant à partir de son state.
     * @param {string} id L'ID de la div HTML allouée.
     * @param {string} state L'état du composant
     */
    this.setState = function (id, state) {
        if (state === undefined)
            return;
        var s = JSON.parse(state);
        file = null;
        file = new javascool.File();
        file.setState(s.file);
        htmlID = id;
        $("#" + htmlID).html("");
        editor = null;
        setup();
        setTitle(file.name);
        editor.scrollTo(s.editor.scroll.x, s.editor.scroll.y);
        editor.refresh();
        editor.focus();
//        javascool.debug(s, file)
    }

    /**
     * Décrit l'état du composant sous la forme d'une chaîne de caractère.
     * @return L'état du composant
     */
    this.getState = function () {
        var state = new Object();
        state.file = this.getFile().getState();
        state.editor = {
            scroll:editor.getScrollInfo(),
            value:editor.getValue()
        }
        return JSON.stringify(state);
    }
};

if (typeof javascool.RessourceLoader != undefined) {
    javascool.RessourceLoader.addJSLibrary("codemirror/mode/clike/clike.js");
    javascool.RessourceLoader.addCSSLibrary("codemirror/theme/eclipse.css");
    javascool.RessourceLoader.addCSSLibrary("codemirror/util/simple-hint.css");
    javascool.RessourceLoader.addJSLibrary("codemirror/util/formatting.js");
    javascool.RessourceLoader.addJSLibrary("codemirror/util/simple-hint.js");
}
(function () {
    if (!CodeMirror.modeExtensions) CodeMirror.modeExtensions = {};
    CodeMirror.modeExtensions["clike"] = {
        commentStart:"/*",
        commentEnd:"*/",
        wordWrapChars:[";", "\\{", "\\}"],

        getNonBreakableBlocks:function (text) {
            var nonBreakableRegexes = [
                new RegExp("for\\s*?\\(([\\s\\S]*?)\\)"),
                new RegExp("\\\\\"([\\s\\S]*?)(\\\\\"|$)"),
                new RegExp("\\\\\'([\\s\\S]*?)(\\\\\'|$)"),
                new RegExp("'([\\s\\S]*?)('|$)"),
                new RegExp("\"([\\s\\S]*?)(\"|$)"),
                new RegExp("//.*([\r\n]|$)")
            ];
            var nonBreakableBlocks = new Array();
            for (var i = 0; i < nonBreakableRegexes.length; i++) {
                var curPos = 0;
                while (curPos < text.length) {
                    var m = text.substr(curPos).match(nonBreakableRegexes[i]);
                    if (m != null) {
                        nonBreakableBlocks.push({
                            start:curPos + m.index,
                            end:curPos + m.index + m[0].length
                        });
                        curPos += m.index + Math.max(1, m[0].length);
                    }
                    else { // No more matches
                        break;
                    }
                }
            }
            nonBreakableBlocks.sort(function (a, b) {
                return a.start - b.start;
            });

            return nonBreakableBlocks;
        },

        autoFormatLineBreaks:function (text, startPos, endPos) {
            text = text.substring(startPos, endPos);
            var curPos = 0;
            var reLinesSplitter = new RegExp("(;|\\{|\\})([^\r\n;])", "g");
            var nonBreakableBlocks = this.getNonBreakableBlocks(text);
            if (nonBreakableBlocks != null) {
                var res = "";
                for (var i = 0; i < nonBreakableBlocks.length; i++) {
                    if (nonBreakableBlocks[i].start > curPos) { // Break lines till the block
                        res += text.substring(curPos, nonBreakableBlocks[i].start).replace(reLinesSplitter, "$1\n$2");
                        curPos = nonBreakableBlocks[i].start;
                    }
                    if (nonBreakableBlocks[i].start <= curPos
                        && nonBreakableBlocks[i].end >= curPos) { // Skip non-breakable block
                        res += text.substring(curPos, nonBreakableBlocks[i].end);
                        curPos = nonBreakableBlocks[i].end;
                    }
                }
                if (curPos < text.length - 1) {
                    res += text.substr(curPos).replace(reLinesSplitter, "$1\n$2");
                }
                return res;
            }
            else {
                return text.replace(reLinesSplitter, "$1\n$2");
            }
        }
    };
})();

(function () {

    /**
     * @return {*}
     */
    function words(str) {
        var obj = new Array(), words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
    }

    CodeMirror.defineMIME("text/x-javascool", {
        name:"clike",
        keywords:words("abstract assert boolean break byte case catch char class const continue default " +
            "do double else enum extends final finally float for goto if implements import " +
            "instanceof int interface long native new package private protected public " +
            "return short static strictfp super switch synchronized this throw throws transient " +
            "try void volatile while String Int"),
        builtin:words("readString echo sleep println readBoolean readInteger"),
        blockKeywords:words("catch class do else finally for if switch try while"),
        atoms:words("true false null"),
        hooks:{
            "@":function (stream, state) {
                stream.eatWhile(/[\w\$_]/);
                return "meta";
            }
        }
    });
})();
(function () {
    function forEach(arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    }

    function arrayContains(arr, item) {
        if (!Array.prototype.indexOf) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        }
        return arr.indexOf(item) != -1;
    }

    function scriptHint(editor, keywords, getToken) {
        var context = context||null;
        // Find the token at the cursor
        var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;
        // If it's not a 'word-style' token, ignore the token.
        if (!/^[\w$_]*$/.test(token.string)) {
            token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                className: token.string == "." ? "property" : null};
        }
        // If it is a property, find out what it is a property of.
        while (tprop.className == "property") {
            tprop = getToken(editor, {line: cur.line, ch: tprop.start});
            if (tprop.string != ".") return;
            tprop = getToken(editor, {line: cur.line, ch: tprop.start});
            if (tprop.string == ')') {
                var level = 1;
                do {
                    tprop = getToken(editor, {line: cur.line, ch: tprop.start});
                    switch (tprop.string) {
                        case ')': level++; break;
                        case '(': level--; break;
                        default: break;
                    }
                } while (level > 0);
                tprop = getToken(editor, {line: cur.line, ch: tprop.start});
                if (tprop.className == 'variable')
                    tprop.className = 'function';
                else return; // no clue
            }
            if(context==null)context=[];
            context.push(tprop);
        }
        return {list: getCompletions(token, context, keywords),
            from: {line: cur.line, ch: token.start},
            to: {line: cur.line, ch: token.end}};
    }

    CodeMirror.javascriptHint = function(editor) {
        return scriptHint(editor, javascriptKeywords,
            function (e, cur) {return e.getTokenAt(cur);});
    };

    function getCoffeeScriptToken(editor, cur) {
        // This getToken, it is for coffeescript, imitates the behavior of
        // getTokenAt method in javascript.js, that is, returning "property"
        // type and treat "." as indepenent token.
        var token = editor.getTokenAt(cur);
        if (cur.ch == token.start + 1 && token.string.charAt(0) == '.') {
            token.end = token.start;
            token.string = '.';
            token.className = "property";
        }
        else if (/^\.[\w$_]*$/.test(token.string)) {
            token.className = "property";
            token.start++;
            token.string = token.string.replace(/\./, '');
        }
        return token;
    }

    CodeMirror.coffeescriptHint = function(editor) {
        return scriptHint(editor, coffeescriptKeywords, getCoffeeScriptToken);
    };

    var stringProps = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
        "toUpperCase toLowerCase split concat match replace search").split(" ");
    var arrayProps = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
        "lastIndexOf every some filter forEach map reduce reduceRight ").split(" ");
    var funcProps = "prototype apply call bind".split(" ");
    var javascriptKeywords = ("break case catch continue debugger default delete do else false finally for function " +
        "if in instanceof new null return switch throw true try typeof var void while with").split(" ");
    var coffeescriptKeywords = ("and break catch class continue delete do else extends false finally for " +
        "if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes").split(" ");

    function getCompletions(token, context, keywords) {
        var found = [], start = token.string;
        function maybeAdd(str) {
            if (str.indexOf(start) === 0 && !arrayContains(found, str)) found.push(str);
        }
        function gatherCompletions(obj) {
            if (typeof obj == "string") forEach(stringProps, maybeAdd);
            else if (obj instanceof Array) forEach(arrayProps, maybeAdd);
            else if (obj instanceof Function) forEach(funcProps, maybeAdd);
            for (var name in obj) maybeAdd(name);
        }

        if (context) {
            // If this is a property, see if it belongs to some object we can
            // find in the current environment.
            var obj = context.pop(), base;
            if (obj.className == "variable")
                base = window[obj.string];
            else if (obj.className == "string")
                base = "";
            else if (obj.className == "atom")
                base = 1;
            else if (obj.className == "function") {
                if (window.jQuery !== null && (obj.string == '$' || obj.string == 'jQuery') &&
                    (typeof window.jQuery == 'function'))
                    base = window.jQuery();
                else if (window._ !== null && (obj.string == '_') && (typeof window._ == 'function'))
                    base = window._();
            }
            while (base !== null && context.length)
                base = base[context.pop().string];
            if (base !== null) gatherCompletions(base);
        }
        else {
            // If not, just look in the window object and any local scope
            // (reading into JS mode internals to get at the local variables)
            for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
            gatherCompletions(window);
            forEach(keywords, maybeAdd);
        }
        return found;
    }
})();


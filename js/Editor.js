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
})()

// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 * @class
 */
javascool.Editor=function() {
    /**
     * @type {javascool.Editor}
     */
    var that=this;

    /**
     * Le fichier en cours d'édition dans cette instance de cet éditeur.
     * @type  {javascool.File}
     */
    var file=null;

    /**
     * L'id de la div html alloué à l'éditeur.
     */
    var htmlID="";

    /**
     * L'id de l'éditeur dans le gestionnaire de Tab d'édition
     */
    var idInTabManager=-1;

    /**
     * L'instance de CodeMirror.
     * @type {CodeMirror}
     */
    var editor=null;
    /**
     * Création et de mise en place de l'éditeur
     * @param {javascool.File} fileObject Le fichier à éditer
     * @param {String} DivID L'ID de la div HTML allouée
     * @param {Number} [RefID=-1] La référance dans le gestionnaire des onglets d'édition. Peut être égal à -1 si l'éditeur est instancié en dehors
     */
    this.setup=function (fileObject, DivID, RefID) {

        // On assigne les valeurs
        file = fileObject;
        htmlID = DivID;
        idInTabManager = (RefID > -1 && RefID != undefined) ? RefID : -1;

        file.$.bind(file.events.NAME_UPDATE,function(){
            $("#" + htmlID).trigger("setTitle",{title:file.name});
        });

        // Création de l'instance de CodeMirror
        try {
            editor = CodeMirror(document.getElementById(htmlID), {
                value:file.content,
                mode:"text/x-javascool",
                theme:"eclipse",
                lineNumbers:true,
                fixedGutter:false,
                gutter:true,
                onChange:function(editor){
                    file.content=editor.getValue();
                }
            });

            if (idInTabManager > -1) {
                $("#" + htmlID).bind("visible", function () {
                    resizer();
                    editor.refresh();
                });
                var resizer = function () {
                    var availibleHeight=$("body").height()-javascool.EditorTabsManager.tabs.$.children(".nav").outerHeight();
                    $(editor.getScrollerElement()).height(availibleHeight);
                    javascool.debug("Taille de la div ",availibleHeight);
                    editor.refresh();
                };
                $(window).bind("resize", resizer);
                resizer();
            }
            editor.refresh();
            editor.focus();
        } catch (e) {
            console.error("Can't setup CodeMirror editor. JS Error : " + e);
            throw e;
        }
    };
    this.getText=function(){
        return editor.getValue();
    };
    this.getFile=function(){
		return file;
    };
};

if(typeof javascool.RessourceLoader!=undefined){
    javascool.RessourceLoader.addJSLibrary("codemirror/mode/clike/clike.js");
    javascool.RessourceLoader.addCSSLibrary("codemirror/theme/eclipse.css");
}

(function(){

    function words(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
    }
    CodeMirror.defineMIME("text/x-javascool", {
        name: "clike",
        keywords: words("abstract assert boolean break byte case catch char class const continue default " +
            "do double else enum extends final finally float for goto if implements import " +
            "instanceof int interface long native new package private protected public " +
            "return short static strictfp super switch synchronized this throw throws transient " +
            "try void volatile while String Int"),
        builtin:words("readString echo println readBoolean readInteger"),
        blockKeywords: words("catch class do else finally for if switch try while"),
        atoms: words("true false null"),
        hooks: {
            "@": function(stream, state) {
                stream.eatWhile(/[\w\$_]/);
                return "meta";
            }
        }
    });
})()

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
                mode:"javascript",
                lineNumbers:true,
                fixedGutter:true,
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
                    editor.setSize(null, parseInt(javascool.EditorTabsManager.tabs.$.children(".tab-content").height()-javascool.EditorTabsManager.tabs.$.children(".nav").height())-5);
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
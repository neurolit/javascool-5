function JVSEditor() {
    /**
     * @type {JVSEditor}
     */
    var that=this;
    /**
     * Le fichier en cours d'édition dans cette instance de cet éditeur
     * @type  JVSFile
     */
    var file=null;
    /**
     * L'id de la div html alloué à l'éditeur
     */
    var htmlID="";
    /**
     * L'id de l'éditeur dans le gestionnaire de Tab d'édition
     */
    var idInTabManager=-1;
    /** L'instance de CodeMirror (interne, ne pas éditer depuis l'extérieur de la classe)
     * @type {CodeMirror}*/
    var editor=null;
    /**
     * Création et de mise en place de l'éditeur
     * @param f Le fichier à éditer
     * @param htmlId L'ID de la div HTML allouée
     * @param id La référance dans le gestionnaire des onglets d'édition. Peut être égal à -1 si l'éditeur est instancié en dehors
     */
    this.setup=function (fileObject, DivID, RefID) {

        // On assigne les valeurs
        file = fileObject;
        htmlID = DivID;
        idInTabManager = (RefID > -1 && id != undefined) ? RefID : -1;

        this.file.$.bind("nameUpdate",function(){
            $("#" + htmlID).trigger("setTitle",{title:file.name});
        })

        // Création de l'instance de CodeMirror
        try {
            editor = CodeMirror(document.getElementById(htmlID), {
                value:file.content,
                mode:"javascript",
                lineNumbers:true,
                fixedGutter:true,
                gutter:true
            });

            if (idInTabManager > -1) {
                $("#" + htmlID).bind("visible", function () {
                    resizer();
                    editor.refresh();
                });
                var resizer = function () {
                    editor.setSize(null, EditorTabsManager.tabs.$.children(".tab-content").height());
                }
                $(window).bind("resize", resizer);
                resizer();
            }
            editor.refresh();
            editor.focus();
        } catch (e) {
            console.error("Can't setup CodeMirror editor. JS Error : " + e);
        }
    };
    this.getText=function(){
        return editor.getValue();
    }
};
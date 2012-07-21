function JVSEditor() {
}


JVSEditor.prototype = {
    /**
     * Le fichier en cours d'édition dans cette instance de cet éditeur
     * @type JVSFile (recommended)
     */
    file:null,
    /**
     * L'id de la div html alloué à l'éditeur
     */
    htmlID:"",
    /**
     * L'id de l'éditeur dans le gestionnaire de Tab d'édition
     */
    idInTabManager:-1,
    /** L'instance de CodeMirror (interne, ne pas éditer depuis l'extérieur de la classe) */
    editor:null,
    /**
     * Création et de mise en place de l'éditeur
     * @param file Le fichier à éditer
     * @param htmlId L'ID de la div HTML allouée
     * @param id La référance dans le gestionnaire des onglets d'édition. Peut être égal à -1 si l'éditeur est instancié en dehors
     */
    setup:function (file, htmlId, id) {

        // On assigne les valeurs
        this.file = file;
        this.htmlID = htmlId;
        this.idInTabManager = (id > -1 && id != undefined) ? id : -1;

        // Création de l'instance de CodeMirror
        var editor = null;
        try {
            editor = CodeMirror($("#" + this.htmlID)[0], {
                value: "function myScript(){return 100;}\n",
                mode:  "javascript",
                lineNumbers: true,
                fixedGutter:true,
                gutter: true
            });
            if(this.idInTabManager>-1){
                $("#" + this.htmlID).bind("visible", function () {
                    resizer();
                    editor.refresh();
                    return false;
                });
                var resizer=function(){
                    var tabH=$("#editorTabs").children(".nav").height(),h=$(window).height();
                    $(editor.getScrollerElement()).height(h-40-tabH+"px");
                    console.log("Editor resized"+tabH)
                }
                $(window).bind("resize",resizer);
                resizer();
            }
            editor.focus();
            editor.setSelection({ line:0, ch:0 }, { line:2, ch:0 });
        } catch (e) {
            console.error("Can't setup CodeMirror editor. JS Error : " + e);
        }
        this.editor = editor;
    }
};
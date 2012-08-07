function JVSEditorTabs() {

}

JVSEditorTabs.prototype = {
    editorClass:"JVSEditor",
    openedFiles:new Array(),
    openedEditors:new Array(),
    tabs:null,
    /**
     * ID de la DIV HTML alloué à l'éditeur.
     */
    htmlID:"LeftTabsPane",
    /**
     * Instance JQuery de la div du gestionnaire.
     * @type {jQuery}
     */
    $:null,

    openFile:function (fileUrl) {
        var id=null;
        if (typeof fileUrl == "string") { // Open a file by url
            Console.log("Not implemented");
        } else { // Open a new File

            // Création de l'instance du nouveau fichier et celle de l'editeur
            var file = new JVSFile();
            var editor = new JVSEditor();

            // Création de l'onglet
            var tabTitle = editor.title == undefined ? file.name : editor.title; // Le titre de l'onglet
            id=this.tabs.addTab(tabTitle);

            // On les références dans les tableaux de l'objet
            this.openedFiles[id] = file;
            this.openedEditors[id] = editor;

            // On ajoute les listeners sur la fermeture du fichier
            $('#'+this.tabs.idForContent(id)).bind('wantToClose',{manager:this,file:file},function (e){
                e.data.manager.closeFile(e.data.file);
            });

            // On passe la main à l'éditeur pour sa construction
            editor.setup(file, this.tabs.idForContent(id), id);
        }
        return id;

    },
    /** Effectue les actions necessaires à la fermeture d'un fichier.
     *
     * @param file Le fichier à fermer ou le tab à fermer
     */
    closeFile:function (file) {
        // TODO: Demander la sauvegarde du fichier
        // On ferme l'onglet
        var i=0;
        for(i=0;i<this.openedFiles.length&&this.openedFiles[i]!=file;i++);
        this.tabs.removeTab(i);
    },
    remove:function () {
        // TODO: Sous forme d'assertion, demander à tous les éditeurs si le document est sauvegardé
        // On nettoie derrière nous
        //$('#leftPart').html('');
    },
    /**
     * Met en place le gestionnaire d'éditeurs.
     * Cette fonction n'est pas dans le constructeur car elle vise à manipuler le DOM de la page.
     * @param divId L'endroit où on doit installer le gestionnaire
     */
    setup:function (divId) {

        this.htmlID = (divId == null) ? this.htmlID : divId;

        // On simplifie l'accesseur JQuery
        this.$ = $("#" + this.htmlID);

        // On initialise le système d'onglets
        this.tabs = new JVSTabs(this.$[0]);

        // On ouvre un nouveau fichier
        this.openFile();
    },
    /**
     * Lance la compilation du code contenu dans l'éditeur courant.
     * Le résultat est redonné par Java par l'événement javascool.compiled sur le document
     */
     compileCurrentFile:function(){
        var id=this.tabs.idOfTabShown, code=this.openedEditors[id].text;
        $.webjavac("compile",code);
    },
    amIOnScreen:function () {
        return this.$.html() != "";
    },
    assertIfAmIOnScreen:function () {
        if (!this.amIOnScreen())
            throw "Editor Tabs is not running in HTML code";
    }
};
if (gui == undefined)
    var gui = new Object();
var EditorTabsManager = new JVSEditorTabs();

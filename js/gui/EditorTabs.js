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
    htmlID:"leftPart",
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

            // Creation des IDs du nouvel onglet
            //var id = this.lastID++, htmlEditorId = "editorForFile-" + id, htmlTabId = "tabForFile-" + id;

            // Création de l'instance du nouveau fichier et celle de l'editeur
            var file = new JVSFile();
            var editor = new JVSEditor();



            // Création de l'onglet
            var tabTitle = editor.title == undefined ? file.name : editor.title; // Le titre de l'onglet
            id=this.tabs.addTab(tabTitle,'The editor will go here',true);

            // On les références dans les tableaux de l'objet
            this.openedFiles[id] = file;
            this.openedEditors[id] = editor;
//            this.$.children(".nav").append("<li class=\"\" id=\"" + htmlTabId + "\"><a href=\"#edit-file-" + id + "\" data-editid=\"" + id + "\" data-toggle=\"tab\">" + tabTitle + "<button class=\"close\">&times;</button></a></li>");
//            $("#" + htmlTabId).tab("show");
//            $("#" + htmlTabId + " a").on('show', function (e) {
//                function idOfTab(domElement) {
//                    var id = parseInt($(domElement).data("editid"), 10);
//                    if (id == undefined)
//                        return -1;
//                    return id;
//                }
//
//                var tab = $(e.target), id = idOfTab(e.target);
//                // On recalcule les IDs
//                var htmlEditorId = "editorForFile-" + id, oldHtmlEditorId = "editorForFile-" + idOfTab(e.relatedTarget);
//
//                // Supprime les éditeurs visibles
//                $("#" + oldHtmlEditorId).removeClass("active").trigger("hidden");
//
//                // Affiche l'editeur voulut
//                $("#" + htmlEditorId).addClass("active").trigger("visible");
//
//            });
//
//            // On ajoute la div de l'éditeur
//            this.$.children(".tab-content").append("<div class=\"tab-pane\" id=\"" + htmlEditorId + "\"></div>");

            // On passe la main à l'éditeur pour sa construction
//            editor.setup(file, htmlEditorId, id);

            // On supprime le message dissant qu'aucun fichier n'est ouvert
            this.hideNoFileMessage();

        }
        return id;

    },
    closeFile:function (file) {

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

        // On lance la configuration des écouteurs sur ce gestionnaire
        this.setupListenersOnEditorTabs();

        // On affiche à l'utilisateur qu'il est censé ouvrir un fichier
//        this.showNoFileMessage();
    },
    showNoFileMessage:function () {
        this.assertIfAmIOnScreen();
        if (this.$.children(".no-file-open").html() == "") {
            this.$.children(".no-file-open").html("<div class=\"alert alert-info centerBoxInfo\">Il faut ouvrir un fichier ou en créer un nouveau</div>");
        }
        this.$.children(".tab-content").hide();
        this.$.children(".nav").hide();
        this.$.children(".no-file-open").show();
    },
    hideNoFileMessage:function () {
        this.assertIfAmIOnScreen();
        this.$.children(".nav").show();
        this.$.children(".no-file-open").hide();
        this.$.children(".tab-content").show();
    },
    setupListenersOnEditorTabs:function () {
        this.assertIfAmIOnScreen();
        if (this.$.data('loaded'))
            return;
        this.$.data('loaded', true);
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
function JVSEditorTabs() {

}

JVSEditorTabs.prototype = {
    editorClass:"JVSEditor",
    openedFiles:new Array(),
    openedEditors:new Array(),
    lastID:0,
    openFile:function (fileUrl) {
        if (typeof fileUrl == "string") { // Open a file by url
            Console.log("Not implemented");
        } else { // Open a new File

            // Creation des IDs du nouvel onglet
            var id = this.lastID++, htmlEditorId = "editorForFile-" + id, htmlTabId = "tabForFile-" + id;

            // Création de l'instance du nouveau fichier et celle de l'editeur
            var file = new JVSFile();
            var editor = new JVSEditor();

            // On les références dans les tableaux de l'objet
            this.openedFiles[id] = file;
            this.openedEditors[id] = editor;

            // Création de l'onglet
            var tabTitle = editor.title == undefined ? file.name : editor.title; // Le titre de l'onglet
            $("#tabsList").append("<li class=\"\" id=\"" + htmlTabId + "\"><a href=\"#edit-file-" + id + "\" data-editid=\"" + id + "\" data-toggle=\"tab\">" + tabTitle + "<button class=\"close\">&times;</button></a></li>");
            //$("#" + htmlTabId).tab("show");
            $("#" + htmlTabId + " a").on('show', function (e) {
                function idOfTab(domElement) {
                    var id = parseInt($(domElement).data("editid"), 10);
                    if (id == undefined)
                        return -1;
                    return id;
                }

                var tab = $(e.target), id = idOfTab(e.target);
                // On recalcule les IDs
                var htmlEditorId = "editorForFile-" + id, oldHtmlEditorId = "editorForFile-" + idOfTab(event.relatedTarget);

                // Supprime les éditeurs visibles
                $("#" + oldHtmlEditorId).removeClass("active").trigger("hidden");

                // Affiche l'editeur voulut
                $("#" + htmlEditorId).addClass("active").trigger("visible");

            });

            // On ajoute la div de l'éditeur
            $("#tabsContent").append("<div class=\"tab-pane\" id=\"" + htmlEditorId + "\"></div>");

            // On passe la main à l'éditeur pour sa construction
            editor.setup(file, htmlEditorId, id);
        }

    },
    getBaseHTML:function () {
        return "<div id=\"editorTabs\">" +
            "<ul class=\"nav nav-tabs\" id=\"tabsList\"></ul>" +
            "<div class=\"tab-content\" id=\"tabsContent\"></div>" +
            "</div>";
    },
    closeTab:function (file) {

    },
    remove:function () {
        // TODO: Sous forme d'assertion, demander à tous les éditeurs si le document est sauvegardé
        // On nettoie derrière nous
        $('#leftPart').html('');
    },
    setup:function () {

        // On vérifie que le gestionnaire d'éditeurs n'est pas déjà en place
        if (this.amIOnScreen())return;

        // Supprime tout le code qui serai dans le div de la partie gauche
        $('#leftPart').html('');

        // On y ajoute notre code pour la mise en place de l'éditeur
        $('#leftPart').html(this.getBaseHTML());

        // On lance la configuration des écouteurs sur ce gestionnaire
        this.setupListenersOnEditorTabs();

        // On ouvre un premier fichier (TODO:Est-ce que l'on impose à l'utilisateur ce fichier ouvert ?)
        this.openFile();
    },
    setupListenersOnEditorTabs:function () {
        this.assertIfAmIOnScreen();
        var myDiv = $("#editorTabs");
        if (myDiv.data('loaded'))
            return;
        myDiv.data('loaded', true);
    },
    amIOnScreen:function () {
        return $("#editorTabs").length > 0;
    },
    assertIfAmIOnScreen:function () {
        if (!this.amIOnScreen())
            throw "Editor Tabs is not running in HTML code";
    }
};
if (gui == undefined)
    var gui = new Object();
var EditorTabsManager = new JVSEditorTabs();
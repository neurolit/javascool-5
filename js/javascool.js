/* Java's cool JS Code 
 * © 2012 INRIA
 * © 2012 Philippe VIENNE
 */

/**
 * Le point d'entrée de l'application Java's Cool
 * @namespace Java's Cool
 * @author Philippe Vienne &gt;PhilippeGeek@gmail.com&lt;
 */
var javascool = function () {

}

/**
 * Emplacement de Java's Cool sur le Disque Dur de l'élève.
 * @type {string}
 * @public
 */
javascool.location = window.location.pathname.replace("/index.html", "");

/**
 * Dernier résultat de compilation
 * @inner
 */
javascool._lastCompileResult = null;

/**
 * Tableau des classes de Widgets de Java's Cool;
 * Tous les classes des MultimediaPane doivents être déclaré à l'intérieur de ce package
 * @type {Object}
 * @namespace Java's Cool Multimedia Panes
 */
javascool.multimediaPanes = {};

/**
 * Effectue une transition graphique entre le panneau de raccourci et le panneau principal.
 * @param {Function} callback La fonction à executer après la transition
 */
javascool.fadeFromShortcutsToPanel = function (callback) {
    javascool.ShortcutsPaneManager.$.fadeOut(function () {
        $("#SliderPane, #ToolBar").fadeIn("fast", callback);
    });
};

/**
 * Effectue une transition graphique entre le panneau principal et le panneau de raccourci.
 * @param {Function} callback La fonction à executer après la transition
 */
javascool.fadeFromPanelToShortcuts = function (callback) {
    $("#ToolBar, #SliderPane").fadeOut("fast", function () {
        javascool.ShortcutsPaneManager.$.fadeIn("fast", callback);
    });
};

/**
 * Lance la compilation du fichier en cours d'édition.
 */
javascool.compileUserCode = function () {
    javascool.EditorTabsManager.compileCurrentFile();
};

/**
 * Execute le dernier programme compilé.
 */
javascool.execUserCode = function () {
    if (this._lastCompileResult == null && !this._lastCompileResult.success) {
        return;
    }
    var classToRun = this._lastCompileResult.compiledClass;
    var popup = new javascool.ProgletApplet(javascool.ProgletsManager.currentProglet);
    popup.openUserProgram(classToRun);
};

/**
 * Ouvre un lien specifique à Java's Cool.
 *  <p>Les liens existants dans Java's Cool sont :
 *      <ul>
 *          <li>proglet://{nom de la proglet}/{document} : Permet de faire un lien au sein de la proglet, avec des fichiers HTML</li>
 *          <li>editor://{file} : Ouvre un fichier en resource dans la proglet</li>
 *          <li>newtab://{document} : C'est comme écrire proglet://{proglet en cours d'execution}/{document}</li>
 *      </ul>
 *  </p>
 * @param {string} url L'adresse à ouvrir
 */
javascool.openLink=function(url){
    var protocole=(url.split("://",1))[0];
    switch(protocole){
        case "editor":
            var file = new javascool.File();
            url=javascool.location+"/proglets/"+javascool.ProgletsManager.currentProglet.namespace+"/"+(url.split("://",2))[1];
            file.content=javascool.PolyFileWriter.load(url);
            javascool.EditorTabsManager.openFile(file);
            break;
        case "newtab":
            javascool.MultimediaTabsManager.open("WebPage",["proglet://"+javascool.ProgletsManager.currentProglet.namespace+"/"+(url.split("://",2))[1]],true);
            break;
        default:
            javascool.debug("Can not open the link :",url);
            break;
    }
};

/**
 * Demande à l'utilisateur d'ouvrir un fichier et lance l'édition
 */
javascool.openFile = function () {
    var file = new javascool.File();
    file.$.one(file.events.OPEN, function () {
        javascool.EditorTabsManager.openFile(file);
    });
    file.open();
};

/**
 * Sauvegarde le fichier en cours d'edition.
 */
javascool.saveFile = function () {
    /**
     * @type {javascool.File}
     */
    var file = javascool.EditorTabsManager.openedFiles[javascool.EditorTabsManager.tabs.idOfTabShown];
    if (file == null || typeof file != "object")
        throw "Hum the file is not a file";
    file.save();
};

var debugEnable = 1, debugEnableOnJavascool = 0;

/**
 * Envoie un message de Debug à la console du navigateur
 */
javascool.debug = function () {
    if (debugEnable) {
        for (var i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
            if (debugEnableOnJavascool) {
                if (typeof arguments[i] != "object") {
                    javascool.Webconsole.print("Debug JS > " + arguments[i]);
                } else {
                    javascool.Webconsole.print("Debug JS > [Object] <i>see the browser debug output</i>");
                }
                javascool.Webconsole.print("\n");
            }
        }
    }
}

/**
 * Ajoute un fichier JS à la page pour le charger
 * @param {string} file L'addresse du fichier dans le dossier lib
 */
javascool.addJSLibrary = function (file) {
    var code = '<script type="text/javascript" src="lib/' + file + '"></script>';
    if (document.readyState == "complete") {
        $("body").append(code);
    } else {
        document.write(code);
    }
}

/**
 * C'est une petite librairie pour gérer l'inclusion de fichier JS et CSS
 * @namespace
 */
javascool.RessourceLoader = {
    /**
     * Ajoute le noeud pour charger le fichier.
     * @param filename Le fichier à inclure
     * @param filetype Le type du fichier "js" ou "css"
     * @private
     */
    _loadjscssfile:function (filename, filetype) {
        if (this._checkIfItWasLoaded(filename))
            return;
        var fileref = null;
        if (filetype == "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype == "css") { //if filename is an external CSS file
            fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (fileref !== null) {
            if (document.readyState == "complete") {
                $("body").append(fileref);
            } else {
                document.getElementsByTagName("head")[0].appendChild(fileref)
            }
        }
    },
    _loaded:[],
    /**
     * Ajoute un fichier JS à la page pour le charger
     * @param {string} file L'addresse du fichier dans le dossier lib
     */
    addJSLibrary:function (file) {
        javascool.RessourceLoader._loadjscssfile("lib/" + file, "js");
    },
    /**
     * Ajoute un fichier CSS à la page pour le charger
     * @param {string} file L'addresse du fichier dans le dossier lib
     */
    addCSSLibrary:function (file) {
        javascool.RessourceLoader._loadjscssfile("lib/" + file, "css");
    },
    _checkIfItWasLoaded:function (file) {
        for (var i = 0; i < this._loaded.length; i++) {
            if (file == this._loaded[i])
                return true;
        }
        return false;
    }
}


/**
 * Fonction de démarrage de Java's Cool.
 * Elle doit être appelé lorsque le document est entièrement chargé.
 */
javascool.init = function () {

    function computeAllSizes() {
        var w = $(window).width(), h = $(window).height();
        //$("body").height(h - $("#MenuBar").outerHeight() + "px");
        $("#viewport").height(h - $("#MenuBar").outerHeight() + "px");
        $("#RightTabsPane, #LeftTabsPane").width(((w / 2) - 2) + 'px');
        $("#splitPart").css({
            position:'absolute',
            left:((w / 2) - 2) + 'px',
            right:((w / 2) - 2) + 'px',
            bottom:0,
            top:0 + 'px'
        });
    }

    // Setup Resize listeners
    $(window).bind("resize", computeAllSizes);
    // Check now
    computeAllSizes();

    // Setup Listeners from Java
    $(document).bind("java.System.out", function (event, data) {
        javascool.Webconsole.print(data);
        return false;
    });

    $(document).bind("javascool.compiled", function (event, result) {
        javascool.MultimediaTabsManager.focusOnConsole();
        javascool._lastCompileResult = result;
        javascool.Webconsole.print(result.console);
        if (result.success) {
            javascool.Webconsole.print("<i class='icon-ok icon-white'></i> Compilation Réussie");
            $("#runButton").attr("disabled", false);
            $("#stopButton").attr("disabled", true);
        } else {
            $("#runButton, #stopButton").attr("disabled", true);
            javascool.Webconsole.print("\n--------\n<i class='icon-remove icon-white'></i>  Echec de la compilation (Voir les erreurs affichées ci dessus)");
        }
        javascool.Webconsole.print("\n--------\n")
    });

    $(document).bind("javascool.user.exec.ended", function (event) {
        $("#runButton, #compileButton").attr("disabled", false);
        $("#stopButton").attr("disabled", true);
    });

    function runOnlyWhenAppletsAreReady() {
        try {
            if (typeof javascool.PolyFileWriter.isActive == "undefined")
                throw 0;
            if (javascool.PolyFileWriter.isActive() && javascool.WebJavac.isActive()) {
                javascool.GUI.loading.update(30, "Chargement des proglets ...")
                javascool.ProgletsManager.init();
                javascool.ShortcutsPaneManager.setup();
                javascool.GUI.loading.update(80, "Lançement du panneau des Proglets")
                javascool.GUI.loading.hide(function () {
                    javascool.ShortcutsPaneManager.$.show();
                });
            } else {
                throw 0;
            }
        } catch (E) {
            if (E == 0) {
                setTimeout(runOnlyWhenAppletsAreReady, 10);
                javascool.debug("Attente des librairies Java ...")
            } else {
                throw E;
            }
        }
    }

    javascool.GUI.loading.update(20, "Recherche des librairies Java")
    runOnlyWhenAppletsAreReady();
}

/**
 * Fonctions et utilitaires pour l' interface utilisateur.
 * @namespace
 */
javascool.GUI = {
    /**
     * Gestion simplifié du panneau de chargement.
     * @class
     */
    loading:{
        id:"LoadingPane",
        /**
         * Affiche le composant de chargement.
         * @param callback La fonction à appeler à la fin de l'animation
         */
        show:function (callback) {
            var c;
            if (typeof callback != "function") {
                c = null;
            } else {
                c = callback;
            }
            $("#" + javascool.GUI.loading.id).fadeIn("fast", c);
        },
        /**
         * Masque le composant de chargement.
         * @param callback La fonction à appeler à la fin de l'animation
         */
        hide:function (callback) {
            var c;
            if (typeof callback != "function") {
                c = null;
            } else {
                c = callback;
            }
            $("#" + javascool.GUI.loading.id).fadeOut("fast", c);
        },
        /**
         * Met à jour le statut de la progression.
         * @param {Number} progress Pourcentage de la progression (0-100)
         * @param {string} [message="Chargement en cours ..."] Message de progression à destination de l'utilisateur
         */
        update:function (progress, message) {
            $("#" + javascool.GUI.loading.id + " .bar").width(progress + "%");
            $("#" + javascool.GUI.loading.id + " .foo").html(message);
        }
    }
};

/**
 *
 * @class
 */
javascool.stateManagment = {
    data:{},
    saveState:function (id, data) {
    },
    askState:function (id, data) {
    },
    load:function () {

    },
    save:function () {

    }
}

$(document).ready(javascool.init);

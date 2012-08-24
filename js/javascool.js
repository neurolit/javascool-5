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
javascool.location=window.location.pathname.replace("/index.html","");

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
    var popup=new javascool.ProgletApplet(javascool.ProgletsManager.currentProglet);
    popup.openUserProgram(classToRun);
    //javascool.WebJavac.exec(classToRun);
//    $("#compileButton, #runButton").attr("disabled", true);
//    $("#stopButton").attr("disabled", false);
};

/**
 * Arrête d'urgence l'execution du code.
 */
javascool.haltUserCode = function () {
    javascool.WebJavac.execStop();
    $("#compileButton, #runButton").attr("disabled", false);
    $("#stopButton").attr("disabled", true);
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

/**
 * Envoie un message de Debug à la console du navigateur
 */
javascool.debug=function(){
    //console.log.apply(window,arguments);
}

/**
 * Fonction de démarrage de Java's Cool.
 * Elle doit être appelé lorsque le document est entièrement chargé.
 */
javascool.init = function () {

    function computeAllSizes() {
        var w = $(window).width(), h = $(window).height();
        $("body").height(h - $("#MenuBar").outerHeight() + "px");
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
    $(window).resize(computeAllSizes);
    // Check now
    computeAllSizes();

    // Setup Listeners from Java
    $(document).bind("java.System.out", function (event, data) {
        javascool.Webconsole.print(data);
        return false;
    });

    $(document).bind("javascool.compiled", function (event, result) {
        console.log("Java's Cool compilation result (debug use)");
        console.log(result);
        javascool._lastCompileResult = result;
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
        try{
            if ( javascool.PolyFileWriter.isActive() && javascool.WebJavac.isActive() ) {
                javascool.GUI.loading.update(30,"Chargement des proglets ...")
                javascool.ProgletsManager.init();
                javascool.ShortcutsPaneManager.setup();
                javascool.GUI.loading.update(80,"Lançement du panneau des Proglets")
                javascool.GUI.loading.hide(function(){
                    javascool.ShortcutsPaneManager.$.show();
                });
            } else {
                throw 0;
            }
        }catch(E){
            if(E==0){
                console.log("Applets not ready");
                setTimeout(runOnlyWhenAppletsAreReady,100);
            } else {
                throw E;
            }
        }
    }
    javascool.GUI.loading.update(20,"Recherche des librairies Java")
    runOnlyWhenAppletsAreReady();
}

/**
 * Fonctions et utilitaires pour l' interface utilisateur.
 * @namespace
 */
javascool.GUI={
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
        show:function(callback){
            if(typeof callback != "function"){
                callback=function(){};
            }
            $("#"+javascool.GUI.loading.id).fadeIn("fast",callback);
        },
        /**
         * Masque le composant de chargement.
         * @param callback La fonction à appeler à la fin de l'animation
         */
        hide:function(callback){
            if(typeof callback != "function"){
                callback=function(){};
            }
            $("#"+javascool.GUI.loading.id).fadeOut("fast",callback);
        },
        /**
         * Met à jour le statut de la progression.
         * @param {Number} progress Pourcentage de la progression (0-100)
         * @param {string} [message="Chargement en cours ..."] Message de progression à destination de l'utilisateur
         */
        update:function(progress,message){
            $("#"+javascool.GUI.loading.id+" .bar").width(progress+"%");
            $("#"+javascool.GUI.loading.id+" .foo").html(message);
        }
    }
};

$(document).ready(javascool.init);

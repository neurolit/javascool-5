/**
 * User: pvienne
 * Date: 7/23/12
 * Time: 10:37 AM
 */
function JVSMultimediaTabs() {

}

JVSMultimediaTabs.prototype = {
    /** Système de gestion des Tabs.
     * @type {JVSTabs}
     */
    tabs:null,
    /**
     * Tableau des MultimediaPanes ouverts.
     * Ils sont indexés par l'id numérique de leur div
     * @private
     */
    openedMultimediaPanes:new Array(),
    /**
     * ID de la DIV HTML alloué à l'éditeur.
     */
    htmlID:"RightTabsPane",
    /**
     * Instance JQuery de la div du gestionnaire.
     * @type {jQuery}
     */
    $:null,
    /**
     * Le lastID est utilisé pour numéroter de façon incrémental les div.
     */
    lastID:0,
    /**
     * Ouvre un MultimediaPane.
     * @param multimediapane L'objet du MultimediaPane ou son type sous forme de {string}
     */
    open:function (multimediapane,options) {
        var pane=(typeof multimediapane=="string")?eval("new "+multimediapane+"()"):multimediapane, id=this.tabs.addTab();

    },
    /**
     * Ferme un MultimediaPane ouvert.
     * @param multimediapane L'objet symbolisant le MultimediaPane ou l'id de ce dernier (entre 0 et MAX_INT (L'infini informatique) )
     * @return {Boolean} Vrai si l'onglet est correctement fermé
     */
    closeTab:function (multimediapane) {
    },
    /**
     * Supprime le DIV des MultimediaPane de l'Ecran
     */
    remove:function () {
        // On nettoie derrière nous le code HTML de la DIV
        $('#'+this.htmlID).remove();
    },
    /**
     * Met en place le gestionnaire de MultimediaPane.
     * Cette fonction n'est pas dans le constructeur car elle vise à manipuler le DOM de la page.
     * @param divId L'endroit où on doit installer le gestionnaire
     */
    setup:function (divId) {
        this.htmlID = (divId == null) ? this.htmlID : divId;

        // On vérifie que le gestionnaire d'éditeurs n'est pas déjà en place et que la div désigné existe
        //if (this.amIOnScreen())return;

        // On simplifie l'accesseur JQuery
        this.$ = $("#" + this.htmlID)

        // On précise qu nous sommes dans un MultimediaTabsPane pour le CSS
        this.$.addClass('MultimediaTabsPane');

        // On crée le gestionnaire d'onglet
        this.tabs=new JVSTabs(this.$[0]);

        // On lance la configuration des écouteurs sur ce gestionnaire
        this.setupListenersOnEditorTabs();

        var test=new JVSWebPage();
        test.setup(document.getElementById(this.tabs.idForContent(this.tabs.addTab("A test"))),"http://fr.wikipedia.org/w/api.php");


    },
    setupListenersOnEditorTabs:function () {
        this.assertIfAmIOnScreen();
        if (this.$.data('loaded'))
            return;
        this.$.data('loaded', true);
    },
    amIOnScreen:function () {
        return this.$.length > 0;
    },
    assertIfAmIOnScreen:function () {
        if (!this.amIOnScreen())
            throw "MultimediaTabsPane is not running in HTML code";
    }
};
var MultimediaTabsManager = new JVSMultimediaTabs();
/**
 * User: pvienne
 * Date: 7/23/12
 * Time: 10:37 AM
 */
function JVSWidgetTabs() {

}

JVSWidgetTabs.prototype = {
    /**
     * Tableau des Widgets ouverts.
     * Ils sont indexés par l'id numérique de leur div
     * @private
     */
    openedWidgets:new Array(),
    /**
     * ID de la DIV HTML alloué à l'éditeur.
     */
    htmlID:"rightPart",
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
     * Retourne le code HTML minimal du gestionnaire
     * @see {JVSWidgetTabs.setup}
     * @return {String}
     */
    getBaseHTML:function () {
        return  "<ul class=\"nav nav-tabs\"></ul>" +
            "<div class=\"tab-content\"></div>";
    },
    /**
     * Ouvre un Widget.
     * @param widget L'objet du widget
     */
    open:function (widget) {
    },
    /**
     * Ferme un widget ouvert.
     * @param widget L'objet symbolisant le Widget ou l'id de ce dernier (entre 0 et MAX_INT (L'infini informatique) )
     * @return {Boolean} Vrai si l'onglet est correctement fermé
     */
    closeTab:function (widget) {
    },
    /**
     * Supprime le DIV des widget de l'Ecran
     */
    remove:function () {
        // TODO: Sous forme d'assertion, demander à tous les éditeurs si le document est sauvegardé
        // On nettoie derrière nous le code HTML de la DIV
        $('#widgetTabs').remove();
    },
    /**
     * Met en place le gestionnaire de Widget.
     * Cette fonction n'est pas dans le constructeur car elle vise à manipuler le DOM de la page.
     * @param divId L'endroit où on doit installer le gestionnaire
     */
    setup:function (divId) {

        this.htmlID = (divId == null) ? this.htmlID : divId;

        // On vérifie que le gestionnaire d'éditeurs n'est pas déjà en place et que la div désigné existe
        if (this.amIOnScreen())return;

        // On simplifie l'accesseur JQuery
        this.$ = $("#" + this.htmlID)

        // Supprime tout le code qui serai dans le div et on y ajoute notre code pour la mise en place de l'éditeur
        this.$.html(this.getBaseHTML());

        // On lance la configuration des écouteurs sur ce gestionnaire
        this.setupListenersOnEditorTabs();

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
            throw "WidgetTabs is not running in HTML code";
    }
};
var WidgetTabsManager = new JVSEditorTabs();
// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 * @class
 */
javascool.MultimediaTabs=function() {

    /**
     * @inner
     * @type {javascool.MultimediaTabs}
     */
    var that=this;

    /** Système de gestion des Tabs.
     * @type {javascool.Tabs}
     */
    this.tabs=null;
    /**
     * Tableau des MultimediaPanes ouverts.
     * Ils sont indexés par l'id numérique de leur div
     * @private
     */
    this.openedMultimediaPanes=new Array();
    /**
     * ID de la DIV HTML alloué à l'éditeur.
     */
    this.htmlID="RightTabsPane";
    /**
     * Instance JQuery de la div du gestionnaire.
     * @type {jQuery}
     */
    this.$=null;
    /**
     * Le lastID est utilisé pour numéroter de façon incrémental les div.
     */
    this.lastID=0;
    /**
     * Ouvre un MultimediaPane.
     * @param multimediapane L'objet du MultimediaPane ou son type sous forme de {string}
     */
    this.open=function (multimediapane,options) {
        var pane=(typeof multimediapane=="string")?eval("new "+multimediapane+"()"):multimediapane, id=this.tabs.addTab();
    };
    /**
     * Ferme un MultimediaPane ouvert.
     * @param multimediapane L'objet symbolisant le MultimediaPane ou l'id de ce dernier (entre 0 et MAX_INT (L'infini informatique) )
     * @return {Boolean} Vrai si l'onglet est correctement fermé
     */
    this.closeTab=function (multimediapane) {
    };
    /**
     * Supprime le DIV des MultimediaPane de l'Ecran
     */
    this.remove=function () {
        // On nettoie derrière nous le code HTML de la DIV
        $('#'+this.htmlID).remove();
    };
    /**
     * Met en place le gestionnaire de MultimediaPane.
     * Cette fonction n'est pas dans le constructeur car elle vise à manipuler le DOM de la page.
     * @param divId L'endroit où on doit installer le gestionnaire
     */
    this.setup=function (divId) {
        this.htmlID = (divId == null) ? this.htmlID : divId;

        // On vérifie que le gestionnaire d'éditeurs n'est pas déjà en place et que la div désigné existe
        //if (this.amIOnScreen())return;

        // On simplifie l'accesseur JQuery
        this.$ = $("#" + this.htmlID)

        // On précise qu nous sommes dans un MultimediaTabsPane pour le CSS
        this.$.addClass('MultimediaTabsPane');

        // On crée le gestionnaire d'onglet
        this.tabs=new javascool.Tabs(this.$[0]);

        // On lance la configuration des écouteurs sur ce gestionnaire
        setupListenersOnEditorTabs();


    };
    /**
     * Ajoute au MultimediaTabs les Widgets de base.
     * Widget de base ;
     *      Une console
     *      Une webpage ouvert sur le mémo
     *      Un Proglet Panel s'il est disponible
     */
    this.addDefaultWidgets=function(){
        var console=new javascool.multimediaPanes.Console(), consoleId=this.tabs.addTab(null,null,null,false);
        console.setup(document.getElementById(this.tabs.idForContent(consoleId)));
        this.tabs.setTitle(consoleId,console.title)
    };
    var setupListenersOnEditorTabs=function () {
        assertIfAmIOnScreen();
        if (that.$.data('loaded'))
            return;
        that.$.data('loaded', true);
    };
    var amIOnScreen=function () {
        return that.$.length > 0;
    };
    var assertIfAmIOnScreen=function () {
        if (!amIOnScreen())
            throw "MultimediaTabsPane is not running in HTML code";
    }
};

/**
 * Instance global du gestionnaire des panneaux multimedias
 * @type {javascool.MultimediaTabs}
 */
javascool.MultimediaTabsManager = new javascool.MultimediaTabs();
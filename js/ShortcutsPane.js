// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 *
 * @class
 */
javascool.ShortcutsPane=function(){

    /**
     * @type {javascool.EditorTabs}
     */
    var that=this;

    this.htmlID="ShortcutsPane";
    /**
     * Instance JQuery de la div du gestionnaire.
     * @type {jQuery}
     */
    this.$=null;
    /**
     * Met en place le gestinnaire du Panneau de Proglet.
     * Cette fonction n'est pas dans le constructeur car elle vise à manipuler le DOM de la page.
     * @param divId L'endroit où on doit installer le gestionnaire
     */
    this.setup=function (divId) {
        if(javascool.ProgletsManager==undefined){
            throw "Error, not in a JVS environement, ProgletsManager is not accessible.";
            return;
        }

        this.htmlID = (divId == null) ? this.htmlID : divId;

        // On simplifie l'accesseur JQuery
        this.$ = $("#" + this.htmlID);
        $(window).resize({objectMain:this}, function(e){
            formatDiv();
        })

        // On crée le Panneau
        this.createShortcutsDiv();
    };
    var formatDiv=function(){
        var w = $(window).width();
        that.$.css("padding", "20px " + ((w % 152) / 2) + "px 20px " + ((w % 152) / 2) + "px");
    };
    /**
     * Crée les div d'icones pour les proglets chargés.
     * @private
     */
    this.createShortcutsDiv=function () {
        // Create the shortcut div
        this.$.html("");
        var proglets = javascool.ProgletsManager.getArray();
        for (var i = 0; i < proglets.length; i++) {
            this.$.append(
                "<div class=\"shortcut btn\" id=\"proglet-" + i
                    + "-shortcut\" onClick=\"javascool.ShortcutsPaneManager.clickEventOnShortcut(" + i
                    + ")\"><div class=\"logo\"><img src=\"" +
                    proglets[i].logo + "\"/></div><div class=\"title\"><h4>" +
                    proglets[i].title + "</h4></div></div>");
        }
        that.$.css("overflow-x","always")
        formatDiv();
    };
    /**
     * Execute les actions lors d'un click sur une icone de proglet
     * @param i Le numéro de la proglet dans le tableau du ProgletManager ou la proglet elle même.
     */
    this.clickEventOnShortcut=function (i) {
        var proglets = javascool.ProgletsManager.getArray();
        if (typeof i != "Proglet") {
            if (proglets[i] != undefined)
                i = proglets[i];
            else
                return;
        }
        javascool.ProgletsManager.start(i);
    }
};

/**
 * Instance général pour le gestionnaire du mur de proglets.
 * @type {javascool.ShortcutsPane}
 */
javascool.ShortcutsPaneManager = new javascool.ShortcutsPane();
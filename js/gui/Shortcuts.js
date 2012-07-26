function ShortcutsPane() {
}

ShortcutsPane.prototype = {
    htmlID:"ShortcutsPane",
    /**
     * Instance JQuery de la div du gestionnaire.
     * @type {jQuery}
     */
    $:null,
    /**
     * Met en place le gestinnaire du Panneau de Proglet.
     * Cette fonction n'est pas dans le constructeur car elle vise à manipuler le DOM de la page.
     * @param divId L'endroit où on doit installer le gestionnaire
     */
    setup:function (divId) {
        if(ProgletsManager==undefined){
            throw "Error, not in a JVS environement, ProgletsManager is not accessible.";
            return;
        }

        this.htmlID = (divId == null) ? this.htmlID : divId;

        // On simplifie l'accesseur JQuery
        this.$ = $("#" + this.htmlID);
        $(window).resize({objectMain:this}, function(e){
            e.data.objectMain.formatDiv();
        })

        // On crée le Panneau
        this.createShortcutsDiv();
    },
    formatDiv:function(){
        var w = this.$.outerWidth();
        this.$.css("padding", "20px " + ((w % 152) / 2) + "px 20px " + ((w % 152) / 2) + "px");
    },
    /**
     * Crée les div d'icones pour les proglets chargés.
     * @private
     */
    createShortcutsDiv:function () {
        // Create the shortcut div
        this.$.html("");
        var proglets = ProgletsManager.getArray();
        for (var i = 0; i < proglets.length; i++) {
            this.$.append(
                "<div class=\"shortcut btn\" id=\"proglet-" + i
                    + "-shortcut\" onClick=\"ShortcutsPaneManager.clickEventOnShortcut(" + i
                    + ")\"><div class=\"logo\"><img src=\"" +
                    proglets[i].logo + "\"/></div><div class=\"title\"><h3>" +
                    proglets[i].name + "</h3></div></div>");
        }
        this.formatDiv();
    },
    /**
     * Affiche le panneau d'icones.
     * @deprecated La fonction est dépendante des autres classes
     */
    showShortcutsDiv:function () {
        if (this.$.html() == "")
            this.createShortcutsDiv();
        $("body").addClass("shortcutsBody");
        $("#states > div").fadeOut(null, function () {
            this.$.fadeIn("slow");
        });
    },
    /**
     * Masque le panneau d'icones.
     * La méthode est asynchrone, la variable callBack permet d'éxecuter un code après le masquage
     * @deprecated La fonction est dépendante des autres classes
     */
    hideShortcutsDiv:function (callBack) {
        $("#shortcuts").fadeOut("fast", function () {
            $("body").removeClass("shortcutsBody");
            if (typeof callBack == "function")callBack();
        });
    },
    /**
     * Execute les actions lors d'un click sur une icone de proglet
     * @param i Le numéro de la proglet dans le tableau du ProgletManager ou la proglet elle même.
     */
    clickEventOnShortcut:function (i) {
        var proglets = ProgletsManager.getArray();
        if (typeof i != "Proglet") {
            if (proglets[i] != undefined)
                i = proglets[i];
            else
                return;
        }
        ProgletsManager.start(i);
    }
};

/**
 * Instance général pour la classe de JVSHomePage.*/
var ShortcutsPaneManager = new ShortcutsPane();
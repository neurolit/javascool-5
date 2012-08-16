// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 * @class
 */
javascool.Proglets=function() {
    this.count=function () {
        return 3;
    };
    this.getArray=function () {
        return javascool.Proglets.cache;
    };
    this.init=function () {
        for (var i = 0; i < this.count(); i++) {
            this.add(new javascool.Proglet());
        }
    };
    this.add=function (proglet) {
        javascool.Proglets.cache[javascool.Proglets.cache.length] = proglet;
    };
    this.start=function (proglet) {
        try {
            javascool.fadeFromShortcutsToPanel(function(){
               javascool.EditorTabsManager.setup();
               javascool.MultimediaTabsManager.setup();
               javascool.MultimediaTabsManager.addDefaultWidgets();
            });
        } catch (e) {
            console.error("Error : " + e + "Are you in a Java's Cool Environement ?");
        }
    };
    this.stop=function () {
        try {
            javascool.fadeFromPanelToShortcuts(function(){});
        } catch (e) {
            console.error("Error : " + e + "Are you in a Java's Cool Environement ?");
        }
    };
};
/**
 * Cache des applets chargés.
 * @type {Array}
 */
javascool.Proglets.cache=new Array();

/**
 * Gestionnaire principale des proglets de Java's Cool.
 * @type {javascool.proglets}
 */
javascool.ProgletsManager = new javascool.Proglets();

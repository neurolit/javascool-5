// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 * Gestionnaire des proglets de Java's Cool.
 * <p>Cette classe permet la gestion des différentes proglets de Java's Cool. Lors de son lancement, la classe va
 * charger le fichier `./proglets/proglets.json` dans lequel les noms des proglets installés sont écrits.</p>
 * <p>Il va lancer la création d'instance de {@link javascool.Proglet} pour tenter le chargement. C'est à la charge de
 * la proglet de venir ensuite s'enregistrer dans le gestionnaire. Il va ensuite l'ajouter au
 * {@link javascool.ShortcutsPane} si il est disponible.</p>
 * @class
 */
javascool.Proglets=function() {
    this.count=function () {
        return 3;
    };
    /**
     * La proglet en cours d'éxecution. La valeur est null si il n'y en a pas.
     * @type {javascool.Proglet}
     */
    this.currentProglet=null;
    this.getArray=function () {
        return javascool.Proglets.cache;
    };
    this.init=function () {
        var progletsToLoad= $.parseJSON(javascool.PolyFileWriter.load(javascool.location+"/proglets/proglets.json"));
        for (var i=0;i<progletsToLoad.length;i++){
            var p=new javascool.Proglet(progletsToLoad[i]);
            this.add(p);
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
            this.currentProglet=proglet;
        } catch (e) {
            console.error("Error : " + e + ". Are you in a Java's Cool Environement ?");
        }
    };
    this.stop=function () {
        try {
            javascool.fadeFromPanelToShortcuts(function(){});
            this.currentProglet=null;
        } catch (e) {
            console.error("Error : " + e + ". Are you in a Java's Cool Environement ?");
        }
    };
};
/**
 * Cache des applets chargés.
 * @type {Array}
 */
javascool.Proglets.cache=new Array();

/**
 * Instance du gestionnaire des proglets de Java's Cool {@link javascool.Proglets}.
 * @type {javascool.Proglets}
 */
javascool.ProgletsManager = new javascool.Proglets();

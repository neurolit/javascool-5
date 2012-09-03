// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 *
 * @class
 */
javascool.EditorTabs=function() {

    /**
     * @type {javascool.EditorTabs}
     */
    var that=this;

    this.openedFiles=new Array();
    this.openedEditors=new Array();

    /**
     * Gestionnaire des tabs
     * @type {javascool.Tabs}
     */
    this.tabs=null;

    /**
     * ID de la DIV HTML alloué à l'éditeur.
     */
    this.htmlID="LeftTabsPane";

    /**
     * Instance JQuery de la div du gestionnaire.
     * @type {jQuery}
     */
    this.$=window.jQuery;

    this.openFile=function (fileUrl) {
        var id = null;
        // Création de l'instance du nouveau fichier et celle de l'editeur
        var file = new javascool.File();
        if(typeof fileUrl == "object"){ // Le fichier est déjà en argument
            file=fileUrl;
        }else if (typeof fileUrl == "string") { // Open a file by url
            file.url = fileUrl;
            file.load();
        }
        // On s'assure que le fichier n'est pas ouvert
        for (var i = 0;
             i < that.openedFiles.length
                 && file.url!="" /* On ne vérifie pas les fichiers tmp */
             ; i++){
            if(that.openedFiles[i]!=null&&that.openedFiles[i].url == file.url){
                that.tabs.showTab(i);
                return i;
            }
        }

        var editor = new javascool.Editor();

        // Création de l'onglet
        var tabTitle = editor.title == undefined ? file.name : editor.title; // Le titre de l'onglet
        id = this.tabs.addTab(tabTitle);

        // On les références dans les tableaux de l'objet
        this.openedFiles[id] = file;
        this.openedEditors[id] = editor;

        // On ajoute les listeners sur la fermeture du fichier
        $('#' + this.tabs.idForContent(id)).bind(this.tabs.events.CLOSING, function (e) {
            if(that.openedFiles[id]){
                e.preventDefault();
                e.stopPropagation();
                that.closeFile(file);
                return false;
            }
        });

        // On passe la main à l'éditeur pour sa construction
        editor.setup(file, this.tabs.idForContent(id), id);
        return id;

    };

    /**
     * Effectue les actions necessaires à la fermeture d'un fichier.
     *
     * @param {javascool.File} file Le fichier à fermer ou le tab à fermer
     */
    this.closeFile=function (file) {
        var close=function(){
            var i = 0;
            // On cherche l'id correspondant au fichier
            for (i = 0; i < that.openedFiles.length && that.openedFiles[i] != file; i++);
            delete that.openedFiles[i];
            delete that.openedEditors[i];
            that.tabs.removeTab(i);
            keepNotEmpty();
        }
        if(file.isModified()){
            file.$.one(file.events.SAVE,close)
            file.save(true);
        }else{
            close();
        }
    };
    /**
     * @deprecated
     */
    this.remove=function () {};

    /**
     * Met en place le gestionnaire d'éditeurs.
     * Cette fonction n'est pas dans le constructeur car elle vise à manipuler le DOM de la page.
     * @param divId L'endroit où on doit installer le gestionnaire
     */
    this.setup=function (divId) {
        if(amIOnScreen())return; // Si le gestionnaire est déjà paramettré, alors on ne fait rien

        // On vérifie l'ID sur lequel on doit installer le gestionnaire
        this.htmlID = (divId == null) ? this.htmlID : divId;

        // On simplifie l'accesseur JQuery
        this.$ = $("#" + this.htmlID);

        // On initialise le système d'onglets
        this.tabs = new javascool.Tabs(this.$[0]);
        try{
        var lastState=$.jStorage.get("javascool.EditorTabs");

        if(lastState!=null&&lastState.length!=0){
            $.each(lastState,function(index,value){
                // Création de l'onglet
                var tabTitle = "title", id = that.tabs.addTab(tabTitle);

                var editor = new javascool.Editor();
                editor.setState(that.tabs.idForContent(id),value);

                // On les références dans les tableaux de l'objet
                that.openedFiles[id] = editor.getFile();
                that.openedEditors[id] = editor;

                // On ajoute les listeners sur la fermeture du fichier
                $('#' + that.tabs.idForContent(id)).bind('wantToClose', function (e) {
                    that.closeFile(editor.getFile());
                });
            })
        }
        }catch(e){}
        setInterval(function(){
            var data=[];
            $.jStorage.set("javascool.EditorTabs",data);
            $.each(that.openedEditors,function(index,value){
                if(value!=undefined)
                data[data.length]=value.getState();
            })
            $.jStorage.set("javascool.EditorTabs",data);
        },500)

        keepNotEmpty();
    };

    /**
     * Lance la compilation du code contenu dans l'éditeur courant.
     * Le résultat est redonné par Java par l'événement javascool.compiled sur le document
     */
    this.compileCurrentFile=function () {
        var id = this.tabs.idOfTabShown, code = this.openedEditors[id].getText();
        javascool.Webconsole.clear();
        javascool.ProgletsManager.currentProglet.compile(code);
    };
    var amIOnScreen=function () {
        try{
            return that.$.html() != "";
        }catch(e){
            return false;
        }
    };
    var assertIfAmIOnScreen=function () {
        if (!amIOnScreen())
            throw "Editor Tabs is not running in HTML code";
    };
    /**
     * Permet de vérifier que le gestionnaire n'est pas vide, si c'est le cas, alors on ouvre un nouveau fichier
     */
    var keepNotEmpty=function(){
        if(that.tabs.count()<=0){
            that.openFile();
        }
    }

    /**
     * Permet de restaurer l'état du composant à partir de son state.
     * @param {*} dom L'objet du dom où le composant sera installé. Il est pris en charge par jQuery.
     * @param {string} state L'état du composant
     */
    this.restore=function(dom,state){

    }

    /**
     * Décrit l'état du composant sous la forme d'une chaîne de caractère.
     * @return L'état du composant
     */
    this.getState=function(){

    }
};
/**
 * Instance global du gestionnaire des editeurs
 * @type {javascool.EditorTabs}
 */
javascool.EditorTabsManager = new javascool.EditorTabs();

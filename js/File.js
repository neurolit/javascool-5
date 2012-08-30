// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 * Symbolisation d'un fichier texte (code, donnés non-binaires etc).
 *
 * <p>Cette classe permet une gestion facilité d'un fichier contenant que du texte. L'objet peut refléter plusieurs
 * fichiers différents au cous de son existance.</p>
 *
 * <p>Elle est principalement utilisé par l'Editeur de Java's Cool pour gérer tout ce qui est attenant au fichier.</p>
 *
 * @class
 * @author Philippe Vienne
 */
javascool.File=function() {

    /** Mot suplémentaire pour this.
     * Cela est obligatoir pour référencer cette classe au sein des fonctions annonymes.
     * @type {JVSFile}
     */
    var that=this;

    /**
     * Le contenu du fichier à sa lecture depuis le disque.
     * Cette variable est utiliser dans {JVSFile.isModified}
     * @type {String}
     */
    this.contentAtOpen="";

    /**
     * L'URL se référant au fichier (elle peut être modifié à la volée.
     * @type {String}
     */
    this.url="";

    /**
     * Nom du fichier avec son extention.
     * @type {String}
     */
    this.name="Nouveau Fichier";

    /**
     * Le contenu actuelle du fichier
     * @type {String}
     */
    this.content="";

    /**
     * Unique Object ID (UOID) pour cette instance du JVSFile.
     * Un ID attribué arbitrairement pour avoir des événement concernant uniquement cette objet même s'il se passe sur
     * le document.
     * @type {String}
     */
    this.id=Math.uuidFast();

    /** La représentation jQuery de cet objet.
     * Ce dernier est utilisé pour la gestion des événement (Il n'y a pas plus efficace)
     * @type {jQuery}
     */
    this.$=$(that);

    /**
     * Lance un événement à tous les listeners de l'objet.
     * @param {String} event Le nom clef de l'événement
     * @param {Object} [data={}] Les donnés à joindre à l'événement (l'instance du fichier est déjà incluse)
     */
    function trigger(event,data){
        data=data||{};
        that.$.trigger(event, $.extend({file:that},data));
    }

    /**
     * Met à jour le nom du fichier à partir de son URL.
     * @see {JVSFile.name}
     * @see {JVSFile.url}
     */
    function setNameFromURL(){
        if(that.url!="")
            that.name=that.url.split(/(\\|\/)/g).pop();
        trigger(that.events.NAME_UPDATE);
    }

    /**
     * Permet de savoir si le fichier a été modifié par rapport à son contenu initial.
     * @return {Boolean} Vrai si le contenu d'origine et celui actuel sont différents
     */
    this.isModified=function(){
        return this.content!=this.contentAtOpen;
    }

    /**
     * Charge le contenu du fichier depuis l'URL de l'instance.
     * @see {JVSFile.url}
     * @return {*} Le contenu du fichier ou Faux en cas d'erreur.
     */
    this.load=function(){
        if(javascool.PolyFileWriter==null){ // Il nous faut la librarie PolyFileWriter pour lire un fichier
            return false;
        }
        try{
            var data=javascool.PolyFileWriter.load(this.url);
            setNameFromURL();
            this.contentAtOpen=this.content=data;
            return data;
        }catch(E){
            return false;
        }
    }

    /**
     * Lance la sauvegarde d'un fichier.
     *
     * Si le fichier est temporaire (Il n'as pas d'URL) ou alors s'il est chargé depuis une adresse réseau alors on
     * éxecute un {JVSFile.saveAs}.
     *
     * Sinon si une confirmation est demandé alors on affiche une boite de dialog à l'utilisateur, si son retour est
     * positif alors on sauvegarde, sinon on envoie l'événement adéquat {JVSFile.events.SAVE_CANCELED} ou
     * {JVSFile.events.SAVE_REFUSED}.
     *
     * Enfin, si aucun des cas ci-dessus nous concerne alors on sauvegarde le fichier et on envoie l'événement
     * {JVSFile.events.SAVE}
     *
     * @param {Boolean} [confirm=false] Demander une confirmation à l'utilisateur avant d'enregistrer le fichier.
     * @return {Boolean} Faux en cas d'erreur (Attention, il faut mieux se fier aux événements qu'au retour car
     *                   certaines tâches sont asynchrones
     */
    this.save=function(confirm){
        confirm=confirm===undefined?false:confirm;
        if(javascool.PolyFileWriter==null){ // Il nous faut la librarie PolyFileWriter pour sauvegarder
            return false;
        }
        if((this.url==""||this.url.substr(0,4)=="http")&&!confirm){ // Si le fichier est sur le web ou temporaire, alors
            this.saveAs();                                          // on enregistre sous
        }else if(confirm){ // Si on doit demander confirmation à l'utilisateur avant d'enregistrer
            bootbox.dialog("Voulez-vous sauvegarder "+this.name+" ?", [{
                "label" : "Non",
                "class" : "btn-danger",
                "callback": function() {
                    trigger(that.events.SAVE);
                }
            }, {
                "label" : "Annuler",
                "class" : "btn-primary"
            },{
                "label" : "Oui",
                "class" : "btn-success",
                "callback": function() {
                    that.save(false);
                }
            }]);
        }else{ // En dernier recours, on enregistre juste le fichier.
            javascool.PolyFileWriter.save(this.url,this.content)
            this.contentAtOpen=this.content;
            setNameFromURL();
            trigger(that.events.SAVE);
        }
    }

    /**
     * Nom de l'évènement pour la sélection d'un fichier dans le saveAs.
     * @type {String}
     */
    var polyfilewriterSaveAsEventName="PFW-File-SaveAs-"+this.id;

    /**
     * Demande à l'utilisateur où enregistrer le fichier.
     * Cette méthode est asynchrone car elle demande une action de la part de l'utilisateur.
     */
    this.saveAs=function(){
        javascool.PolyFileWriter.askFile(true,null,null,polyfilewriterSaveAsEventName);
    }

    // Se réfère à la methode {JVSFile.saveAs}
    $(document).bind(polyfilewriterSaveAsEventName,function(e,selectedFile){
        if(selectedFile===null||selectedFile===undefined){
            return;
        }
        if(!selectedFile.match(/.*\.jvs$/i)){
            selectedFile=selectedFile+".jvs";
        }
        that.url=selectedFile;
        setNameFromURL();
        that.save();
    });

    /**
     * Nom de l'évènement pour la sélection d'un fichier dans le open.
     * @type {String}
     */
    var polyfilewriterOpenEventName="PFW-File-Open-"+this.id;

    /**
     * Demande à l'utilisateur le fichier à ouvrir.
     * Cette méthode est asynchrone car elle demande une action de la part de l'utilisateur.
     * Pour obtenir le résultat de cette méthode, il faut écouter l'événement {JVSFile.events.OPEN}.
     */
    this.open=function(){
        javascool.PolyFileWriter.askFile(false,null,null,polyfilewriterOpenEventName);
    }
    $(document).bind(polyfilewriterOpenEventName,function(e,selectedFile){
        if(selectedFile===null){
            return;
        }
        that.url=selectedFile;
        setNameFromURL();
        that.load();
        trigger(that.events.OPEN);
    });

    /**
     * Permet de restaurer l'état du fichier à partir de son state.
     * @param {string} state L'état du composant
     */
    this.setState=function(state){
        var s=JSON.parse(state);
        that.url= s.url;
        that.content= s.content;
        that.contentAtOpen= s.contentAtOpen;
        that.name= s.name;
        that.id= s.id;
    }

    /**
     * Décrit l'état du fichier sous la forme d'une chaîne de caractère.
     * @return L'état du fichier
     */
    this.getState=function(){
        return JSON.stringify({
            url:that.url,
            content:that.content,
            contentAtOpen:that.contentAtOpen,
            name:that.name,
            id:that.id
        });
    }
    /**
     * Liste des événements possible dans le {JVSFile}.
     * @type {Object}
     */
    this.events={
        /**
         * Le contenu du fichier a été chargé depuis le fichier dans l'instance.
         */
        LOAD:"fileLoad",
        /**
         * Un fichier vient d'être ouvert dans l'instance.
         */
        OPEN:"fileOpen",
        /**
         * Le fichier a été correctement sauvegardé
         */
        SAVE:"fileSave",
        /**
         * La sauvegarde a été refusé par l'utilisateur (Boutton NON).
         */
        SAVE_REFUSED:"fileSaveRefused",
        /**
         * La sauvegarde a été annulé par l'utilisateur (Boutton ANNULER).
         */
        SAVE_CANCELED:"fileSaveCanceled",
        /**
         * Le nom du fichier a été mis à jours.
         */
        NAME_UPDATE:"fileNameUpdate"
    };
}

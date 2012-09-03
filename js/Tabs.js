// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 * @class
 */
javascool.Tabs=function(domElem) {
    var that=this;
    this.$ = $(domElem);
    this.id=Math.uuid(5,16);
    this.$.addClass("jvstabs");
    $(window).bind("resize",function(){
        that._reformatDivSizes();
    });

    this._reformatDivSizes=function(){
        that.$.children('.tab-content').height((that.$.innerHeight()-that.$.children('.nav').outerHeight())-1)
    }
    
    this.$.html('<ul class="nav nav-pills"></ul><div class="tab-content"></div>');

    this.events={
        CLOSE_BUTTON_CLICK:"wantToClose",
        CLOSING:"closing"
    };
    /**
     * Le lastID est utilisé pour numéroter de façon incrémental les div.
     */
    this.lastID=0;
    
    /**
     * L'ID de l'onglet actuellement affiché à l'écran.
     * Il peut ne pas correspondre à la réalité dans le cas où tous les onglets ont déjà été fermés.
     */
    this.idOfTabShown=null;
    
    /**
    * Ajoute un onglet au gestionnaire.
    * @param {string} [title="Onglet"] Le titre de l'onglet.
    * @param {string} [content=""] Le contenu à ajouter par défaut.
    * @param {boolean} [donotshow=false] Indique si on ne doit pas montrer cet onglet après sa création.
    * @param {boolean} [canbeclosed=true] Indique si l'onglet peut être fermer.
     * @return L'ID de ce tab.
    */
    this.addTab=function (title, content, donotshow, canbeclosed) {
        title=title||"Onglet";
        content=content||"";
        donotshow=donotshow||false;
        if(canbeclosed===true||canbeclosed===undefined||canbeclosed===null){canbeclosed=true;}else{canbeclosed=false;}
        var id=this.lastID++;
        this.$.children('.nav').append('<li id="'+this.idForTab(id)+'"><a class="link"><span class="tabtitle">'+title+'</span>'+(canbeclosed?'<span class="icon-remove-circle closeIcon"></span>':'')+'</a></li>');
        if(canbeclosed){
            $('#'+this.idForTab(id)+' a .closeIcon').click({tabs:this,id:id},function(e){
                that.removeTab(id);
                return false;
            });
        }
        $('#'+this.idForTab(id)+' a').click({tabs:this,id:id},function(e){
            e.data.tabs.showTab(e.data.id);
        });
        this.$.children('.tab-content').append('<div id="'+this.idForContent(id)+'" class="tab-pane">'+content+'</div>');
        $("#"+this.idForContent(id)).bind("setTitle",{tabs:this,id:id},function(e,title){
            e.data.tabs.setTitle(e.data.id,title);
        })
        this._reformatDivSizes();
        donotshow?null:this.showTab(id);
        return id;
    };
    /**
     * Propage la demande de fermeture de l'utilsateur (clique sur la croix).
     * Cette fonction permet d'installer des listeners sur la div enfant de contenu ({@link javascool.Tabs#idForContent}) afin
     * de les laisser faire les actions necessaire pour la fermeture. (ex.: Enregistrer un fichier ...).
     * @param {number} id L'ID de l'onglet à fermer.
     */
    this.propagateCloseOnTab=function(id){
        $('#'+this.idForContent(id)).trigger("wantToClose",{tabs:this,id:id});
    };
    /**
     * Supprime un onglet du gestionnaire.
     * La fonction propage tout d'abord l'événement {@link javascool.Tabs#events.CLOSING} sur tous les enfants.
     * Si l'événement n'a pas été stopé, alors on ferme. Sinon on laisse tout en place.
     * @param {number} id L'ID de l'onglet à supprimer.
     */
    this.removeTab=function (id) {
        // On prévient les deux enfant que l'on ferme
        var event = jQuery.Event(this.events.CLOSING);
        $('#'+this.idForTab(id)+', #'+this.idForContent(id)).trigger(event);
        if ( !event.isPropagationStopped() ) { // S'ils sont tous d'accord, alors on ferme
            // On ferme
            $('#'+this.idForTab(id)+', #'+this.idForContent(id)).remove();
        }
        this._reformatDivSizes();
    };
    /**
     * Affiche un onglet à l'écran.
     * @param {number} id L'ID de l'onglet à afficher.
     */
    this.showTab=function(id){
        if(this.idOfTabShown!=null){
            // On masque l'onglet actif
            $('#'+this.idForTab(this.idOfTabShown)+', #'+this.idForContent(this.idOfTabShown)).removeClass('active');
        }
        // On affiche l'onglet #id
        $('#'+this.idForTab(id)+', #'+this.idForContent(id)).addClass('active');
        this.idOfTabShown=id;
        this._reformatDivSizes();
    };
    /**
     * Change le titre de l'onglet.
     * @param id L'identifiant de l'onglet
     * @param newTitle Le titre de l'onglet à mettre
     */
    this.setTitle=function(id,newTitle){
        $('#'+this.idForTab(id)).find(".tabtitle").html(newTitle);
    };
    this.idFor=function(element,id){
        return this.id+'-'+element+'-'+id
    };
    this.idForTab=function(id){
        return this.idFor('tab',id);
    };
    this.idForContent=function(id){
        if(id==null)id=this.lastID;
        return this.idFor('content',id);
    }

    /**
     * Permet de connaître le nombre actuel d'onglets ouverts
     */
    this.count=function(){
        return this.$.children().size();
    }
};

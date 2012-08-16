// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}

/**
 *@class
 */
javascool.Tabs=function(domElem) {
    this.$ = $(domElem);
    this.id=Math.uuid(5,16);
    this.$.addClass("jvstabs");
    this.$.resize({tabs:this},function(e){
        var tabs= e.data.tabs;
        tabs.$.children('.tab-content').height((tabs.$.height()-tabs.$.children('.nav').outerHeight()))
        console.log((tabs.$.height()));
    });
    this.$.html('<ul class="nav nav-pills"></ul><div class="tab-content"></div>');

    this.events={
        CLOSE_BUTTON_CLICK:"wantToClose"
    };
    /**
     * Le lastID est utilisé pour numéroter de façon incrémental les div.
     */
    this.lastID=0;
    this.idOfTabShown=null;
        this.addTab=function (title, content, donotshow, canbeclosed) {
        title=title||"Onglet";
        content=content||"";
        donotshow=donotshow||false;
        if(canbeclosed===true||canbeclosed===undefined||canbeclosed===null){canbeclosed=true;}else{canbeclosed=false;}
        var id=this.lastID++;
        this.$.children('.nav').append('<li id="'+this.idForTab(id)+'"><a class="link"><span class="tabtitle">'+title+'</span>'+(canbeclosed?'<span class="icon-remove-circle closeIcon"></span>':'')+'</a></li>');
        if(canbeclosed){
            $('#'+this.idForTab(id)+' a .closeIcon').click({tabs:this,id:id},function(e){
                e.data.tabs.propagateCloseOnTab(e.data.id);
                return false;
            });
        }
        $('#'+this.idForTab(id)+' a').click({tabs:this,id:id},function(e){
            e.data.tabs.showTab(e.data.id);
        });
        this.$.children('.tab-content').append('<div id="'+this.idForContent(id)+'" class="tab-pane">'+content+'</div>');
        $("#"+this.idForContent(id)).bind("setTitle",{tabs:this,id:id},function(e){
            e.data.tabs.setTitle(e.data.id,e.data.title);
        })
        this.$.trigger("resize");
        donotshow?null:this.showTab(id);
        return id;
    };
    this.propagateCloseOnTab=function(id){
        $('#'+this.idForContent(id)).trigger("wantToClose",{tabs:this,id:id});
    };
    this.removeTab=function (id) {
        // On prévient les deux enfant que l'on ferme
        var event = jQuery.Event("closing");
        $('#'+this.idForTab(id)+', #'+this.idForContent(id)).trigger(event);
        if ( !event.isPropagationStopped() ) { // S'ils sont tous d'accord, alors on ferme
            // On ferme
            $('#'+this.idForTab(id)+', #'+this.idForContent(id)).remove();
        }

    };
    this.showTab=function(id){
        if(this.idOfTabShown!=null){
            // On masque l'onglet actif
            $('#'+this.idForTab(this.idOfTabShown)+', #'+this.idForContent(this.idOfTabShown)).removeClass('active');
        }
        // On affiche l'onglet #id
        $('#'+this.idForTab(id)+', #'+this.idForContent(id)).addClass('active');
        this.idOfTabShown=id;
    };
    /**
     * Change le titre de l'onglet.
     * @param id L'identifiant de l'onglet
     * @param newTitle Le titre de l'onglet à mettre
     */
    this.setTitle=function(id,newTitle){
        $('#'+this.idForTab(id)).find(".tabtitle").html(newTitle);
    };
    this.count=function () {
        return this.$.children(".nav-tabs").children().length();
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
};
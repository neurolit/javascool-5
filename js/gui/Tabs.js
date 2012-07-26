/**
 * User: pvienne
 * Date: 7/23/12
 * Time: 4:30 PM
 */
function JVSTabs(domElem) {
    this.$ = $(domElem);
    this.id=Math.uuid(5,16);
    this.$.addClass("jvstabs");
    this.$.html('<ul class="nav nav-pills"></ul><div class="tab-content"></div>');
}
JVSTabs.prototype = {
    /**
     * Le lastID est utilisé pour numéroter de façon incrémental les div.
     */
    lastID:0,
    idOfTabShown:null,
    addTab:function (title, content, donotshow) {
        title=title||"Onglet";
        content=content||"";
        donotshow=donotshow==null?false:donotshow;
        var id=this.lastID++;
        this.$.children('.nav').append('<li id="'+this.idForTab(id)+'"><a class="link"><span class="tabtitle">'+title+'</span><span class="icon-remove-circle closeIcon"></span></a></li>');
        $('#'+this.idForTab(id)+' a .closeIcon').click({tabs:this,id:id},function(e){
            e.data.tabs.propagateCloseOnTab(e.data.id);
            return false;
        });
        $('#'+this.idForTab(id)+' a').click({tabs:this,id:id},function(e){
            e.data.tabs.showTab(e.data.id);
        });
        this.$.children('.tab-content').append('<div id="'+this.idForContent(id)+'" class="tab-pane">'+content+'</div>');
        donotshow?null:this.showTab(id);
        return id;
    },
    propagateCloseOnTab:function(id){
        $('#'+this.idForContent(id)).trigger("wantToClose",{tabs:this,id:id});
    },
    removeTab:function (id) {
        // On prévient les deux enfant que l'on ferme
        var event = jQuery.Event("closing");
        $('#'+this.idForTab(id)).triggerHandler(event);
        $('#'+this.idForContent(id)).triggerHandler(event);
        // Todo: Annuler la fermeture si la propagation a été arrêté de force
//        if ( event.isDefaultPrevented() ) { // S'ils sont tous d'accord, alors on ferme
            // On ferme
            $('#'+this.idForTab(id)+', #'+this.idForContent(id)).remove();
//        }

    },
    showTab:function(id){
        if(this.idOfTabShown!=null){
            $('#'+this.idForTab(this.idOfTabShown)+', #'+this.idForContent(this.idOfTabShown)).removeClass('active');
        }
        $('#'+this.idForTab(id)+', #'+this.idForContent(id)).addClass('active');
        this.idOfTabShown=id;
    },
    /**
     * Change le titre de l'onglet.
     * @param id L'identifiant de l'onglet
     * @param newTitle Le titre de l'onglet à mettre
     */
    changeTitle:function(id,newTitle){
        $('#'+this.idForTab(id)).find(".tabtitle").html(newTitle);
    },
    count:function () {
        return this.$.children(".nav-tabs").children().length();
    },
    idFor:function(element,id){
        return this.id+'-'+element+'-'+id
    },
    idForTab:function(id){
        return this.idFor('tab',id);
    },
    idForContent:function(id){
        if(id==null)id=this.lastID;
        return this.idFor('content',id);
    }
};
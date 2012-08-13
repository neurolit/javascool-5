function JVSFile() {
    /** Mot suplémentaire pour this
     * @type {JVSFile}
     */
    var that=this;
    this.contentAtOpen="";
    this.url="";
    this.name="Nouveau Fichier";
    this.content="";
    this.id=Math.uuidFast();
    /** La représentation jQuery de cet objet.
     * @type {jQuery}
     */
    this.$=$(this);
    var setNameFromURL=function(){
        if(that.url!="")
            that.name=that.url.split(/(\\|\/)/g).pop();
        this.$.trigger("nameUpdate");
    }
    this.isModified=function(){
        return this.content!=this.contentAtOpen;
    }
    this.load=function(){
        if($.polyfilewriter==null){ // Il nous faut la librarie PolyFileWriter pour lire un fichier
            return false;
        }
        try{
            var data=$.polyfilewriter("load",this.url);
            setNameFromURL();
            this.contentAtOpen=this.content=data;
            return data;
        }catch(E){
            return false;
        }
    }
    this.save=function(confirm){
        confirm=confirm===undefined?false:confirm;
        if($.polyfilewriter==null){ // Il nous faut la librarie PolyFileWriter pour sauvegarder
            return false;
        }
        if(this.url==""||this.url.substr(0,4)=="http"){ // Si le fichier est sur le web ou temporaire, alors on enregistre sous
            this.saveAs();
        }else if(confirm){ // Si on doit demander confirmation à l'utilisateur avant d'enregistrer
            bootbox.confirm("Voulez-vous sauvegarder "+this.name+" ?",function(r){
                if(r){
                    $.polyfilewriter("save",this.url,this.content)
                    this.contentAtOpen=this.content;
                    setNameFromURL();
                }
            })
        }else{ // En dernier recours, on enregistre juste le fichier.
            $.polyfilewriter("save",this.url,this.content)
            this.contentAtOpen=this.content;
            setNameFromURL();
        }
    }
    /**
     * Nom de l'évènement pour la sélection d'un fichier dans le saveAs.
     * @type {String}
     */
    var polyfilewriterSaveAsEventName="PFW-File-SaveAs-"+this.id;
    var openCallback=function(){console.log("No open callback")};
    /**
     *
     */
    this.saveAs=function(){
        $.polyfilewriter("askFile",true,null,null,polyfilewriterSaveAsEventName);
    }
    $(document).bind(polyfilewriterSaveAsEventName,function(e,selectedFile){
        if(selectedFile===null){
            return;
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
    var openCallback=function(){console.log("No open callback")};
    /**
     *
     */
    this.open=function(){
        if(typeof arg[0]=="function")
            openCallback=arg[0];
        $.polyfilewriter("askFile",false,null,null,polyfilewriterOpenEventName);
    }
    $(document).bind(polyfilewriterOpenEventName,function(e,selectedFile){
        if(selectedFile===null){
            return;
        }
        that.url=selectedFile;
        setNameFromURL();
        that.load();
    });
}
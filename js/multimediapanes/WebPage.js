// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={
        multimediaPanes:{}
    };
}

/**
 *
 * @class
 */
javascool.multimediaPanes.WebPage=function(){
    this.isWidget=true;
    var history=[];
    var historyPos=-1;
    var currentUrl='';
    var lastProglet="";
    /**
     * @type {jQuery}
     */
    this.$=null;
    this.title='WebTab';

    /**
     *
     * @type {javascool.multimediaPanes.WebPage}
     */
    var that=this;

    var startWith=function(str,prefix){
        if(str.indexOf(prefix)==0)
            return true;
        else
            return false;
    }

    var parseURL=function(link){
        var url=""+link;
        if(startWith(url,"http://"))
            return url;
        else if(startWith(url,"file://"))
            return url.substring(7,url.length);
        else if(startWith(url,"proglet://"))
            return javascool.location+"/proglets/"+url.substring("proglet://".length,url.length);
    }

    /**
     * Met à jour le titre de l'onglet
     */
    var updateName=function(name){
        that.title=name;
        that.$.trigger("setTitle",name);
    }

    /**
     * Cette fonction calcule les propriétés CSS du WebPage.
     * Elle doit être appelé à chaque fois que la taille du WebPage peut avoir changé
     */
    this.validate=function(){
        if(this.$==null)
            return;
        var toolbar=this.$.children(".toolbar"), content=this.$.children(".content"), h=this.$.height(), w=this.$.width();
        content.css({
            height:(h-toolbar.outerHeight(true)-8)+"px",
            padding:"4px"
        })
    }

    function pushURLToStack(url){
        historyPos++;
        while(history.length>historyPos){
            history.pop();
        }
        history.push(url)
    }

    /**
     * Charge une page Web dans le composant.
     *
     * @param {string} url L'adresse à charger, elle peux avoir les formes suivantes :
     *          <ul>
     *              <li><i>proglet://{nom de la proglet}/{document}</i></li>
     *              <li><i>file://{adresse du fichier à charger}</i></li>
     *              <li><b>À éviter : (faille XSS)</b> http://{adresse web}</li>
     *          </ul>
     */
    this.load=function(url){
        if(currentUrl==url) // On ne charge pas deux fois le même fichier
            return;
        if(javascool.PolyFileWriter.exists(parseURL(url))==false) // On verifie que le fichier existe
            return;
        // On ajoute l'URL dans l'historique
        pushURLToStack(url);
        // On charge la page
        this._showUrl(url);
    };

    /**
     * Réactualise le nom du composant à partir de l'url actuel.
     * @private
     * @see updateName
     * @see currentUrl
     */
    this._refreshName=function(){
        if(currentUrl!=null){
            var title=currentUrl.split("/").pop();
            title=title.split(".").shift();
            title=title.charAt(0).toUpperCase() + title.slice(1);
            if(title!=""){
                updateName(title)
            }
        }
    };

    /**
     * Affiche une page web.
     * @param url
     * @private
     */
    this._showUrl=function(url){
        currentUrl=url;
        this.$.children(".content").html(this._progletHelpParse(javascool.PolyFileWriter.load(parseURL(url))));
        this._refreshName();
    };

    /**
     * Corrige les defauts des pages web des proglets tel que les liens vers les images.
     * @param data Les donnés à editer.
     * @return {string} Le code à écrire dans la page
     * @private
     */
    this._progletHelpParse=function(data){
        var page=$(data), url=currentUrl;
        if(!startWith(url,"proglet://"))return data;
        var file=url.substring("proglet://".length,url.length);
        var proglet=file.substring(0,file.indexOf("/"));
        that.lastProglet=proglet;
        page.find("img").each(function(elem){
            $(this).attr("src",javascool.location+"/proglets/"+proglet+"/"+$(this).attr("src"));
        });
        return page;
    }

    /**
     * Affiche la page suivante si elle est disponible.
     */
    this.nextPage=function(){
        if(history.length>(historyPos+1)){
            historyPos++;
            this._showUrl(history[historyPos]);
        }
    };

    /**
     * Affiche la page précédante si elle est disponible.
     */
    this.previousPage=function(){
        if(history.length>0&&historyPos>0){
            historyPos--;
            this._showUrl(history[historyPos]);
        }
    };

    /**
     * Configure le WebPage.
     * C'est une sorte de constructeur alternatif.
     * @param {*} dom L'objet du dom où le navigateur sera installé. Il est pris en charge par jQuery.
     * @param {String} [url=null] L'url à charger, voir {@link javascool.multimediaPanes.WebPage#load}
     * @param {String} [title="WebTab"] Le titre à donner au WebPage.
     */
    this.setup=function(dom,url,title){
        if(this.$!==null)
            return;
        this.$=$(dom);
        this.$.html('<div class="toolbar">' +
            '<div class="left-tools"><button class="btn previous"><i class="icon-chevron-left"></i>&nbsp;Précédent</button></div>' +
            '<div class="right-tools"><button class="btn next">Suivant&nbsp;<i class="icon-chevron-right"></i></button></div> ' +
            '</div>' +
            '<div class="content"></div> ');
        this.$.addClass("webpage");
        this.$.find(".previous").click(function(event){
            that.previousPage();
        });
        this.$.find(".next").click(function(event){
            that.nextPage();
        });
        this.$.children(".content").on("click", "a", function(event){
            event.preventDefault();
            try{
                var link=$(this).attr("href");
                if(startWith(link,"http://editor?")){
                    link=link.replace("http://editor?","editor://");
                } else if (startWith(link,"http://newtab?")){
                    link=link.replace("http://newtab?","newtab://");
                }
                if(link.match(/^(http|mailto):\/\//)){
                    window.open(link, '_blank');
                } else {
                    if(link.match(/^[a-z]+:\/\//i)){ // On a un protocole specifique à Java's Cool
                        javascool.openLink(link);
                    } else if(link.match(/[a-z\-_"'éèàâî\.]+/i)){
                        that.load("proglet://"+that.lastProglet+"/"+link)
                    }
                }
            }catch(E){console.error(E)}
            return false;
        });
        this.title=title||this.title;
        updateName("Toto");
        this.load(url);
        $(window).bind("resize",function(){
            that.validate();
        });
        this.validate();
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
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
    /**
     * @type {jQuery}
     */
    this.$=null;
    this.title='WebTab';

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
     *
     * @param {string} url
     */
    this.load=function(url){
        var $ContentDiv=this.$.children('.content');
        console.log("load ",parseURL(url))
        var data=$(javascool.PolyFileWriter.load(parseURL(url))).find(".container").last();
        currentUrl=url;
        history.push(url);
        historyPos
        if(startWith(url,"proglet://")){
            var file=url.substring("proglet://".length,url.length);
            var proglet=file.substring(0,file.indexOf("/"));
            $(data).find("img").each(function(elem){
                $(this).attr("src",javascool.location+"/proglets/"+proglet+"/"+$(this).attr("src"));
            })
        }
        $ContentDiv.html(data);
    };
    this.setup=function(dom,url,title){
        this.$=$(dom);
        this.$.html('<div class="toolbar">' +
            '<div class="left-tools"><button class="btn"><i class="icon-chevron-left"></i>&nbsp;Précédent</button></div>' +
            '<div class="right-tools"><button class="btn">Suivant&nbsp;<i class="icon-chevron-right"></i></button></div> ' +
            '</div>' +
            '<div class="content"></div> ');
        this.$.children(".content").on("click", "a", function(event){

            event.preventDefault();
        });
        this.title=title||this.title;
        this.load(url)
    }
};
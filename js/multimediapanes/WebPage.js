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
    var url='';
    /**
     * @type {jQuery}
     */
    this.$=null;
    this.title='WebTab';
    this.load=function(url){
        var $ContentDiv=this.$.children('.content');
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(data) {
                $ContentDiv.html(data);
            }
        });
    };
    this.setup=function(dom,url,title){
        this.$=$(dom);
        this.$.html('<div class="toolbar">' +
            '<div class="left-tools"><button class="btn"><i class="icon-chevron-left"></i>&nbsp;Précédent</button></div>' +
            '<div class="right-tools"><button class="btn">Suivant&nbsp;<i class="icon-chevron-right"></i></button></div> ' +
            '</div>' +
            '<div class="content"></div> ');
        this.title=title||this.title;
        this.load(url)
    }
};
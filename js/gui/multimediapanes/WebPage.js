function JVSWebPage(){}
JVSWebPage.prototype={
    isWidget:true,
    history:[],
    historyPos:-1,
    url:'',
    /**
     * @type {jQuery}
     */
    $:null,
    title:'WebTab',
    load:function(url){
        var $ContentDiv=this.$.children('.content');
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(data) {
                $ContentDiv.html(data);
            }
        });
    },
    setup:function(dom,url,title){
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
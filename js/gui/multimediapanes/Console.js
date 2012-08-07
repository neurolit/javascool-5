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
    title:'Console',
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
    setup:function(dom,donotregisterasglobal){
        this.$=$(dom);
        this.$.html('<pre class="span6" id="console">I\'m your console for the demo.\n  All output (compilation and java) happens here. </pre> ');
        webconsole.consoles[webconsole.consoles.length]=this;
    }
};
var webconsole={
    consoles:[],
    print:function(what){
         for(var i=0;i<webconsole.consoles.length;i++){
             webconsole.consoles[i].print(what);
         }
    },
    clear:function(){
        for(var i=0;i<webconsole.consoles.length;i++){
            webconsole.consoles[i].clear();
        }
    }
};
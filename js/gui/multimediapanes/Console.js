function JVSConsole(){}
JVSConsole.prototype={
    isWidget:true,
    /**
     * @type {jQuery}
     */
    $:null,
    /**
     * @type {jQuery}
     */
    $console:null,
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
        if(this.$!==null)return;
        this.$=$(dom);
        this.$.html('<div class="console"><pre class=""></pre></div> ');
        this.$console=this.$.children(".console").children("pre");
        if(donotregisterasglobal==undefined?true:donotregisterasglobal)
            webconsole.consoles[webconsole.consoles.length]=this;
    },
    print:function(what) {
        this.$console.append(what);
        var consoleDiv=this.$.children(".console");
        consoleDiv.animate({ scrollTop: consoleDiv.prop("scrollHeight") - consoleDiv.height() }, 0);
    },
    clear:function(){
        this.$console.html("");
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
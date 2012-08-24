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
javascool.multimediaPanes.Console=function(){
    this.isWidget=true;
    /**
     * @type {jQuery}
     */
    this.$=null;
    /**
     * @type {jQuery}
     */
    this.$console=null;
    this.title='Console';

    this.setup=function(dom,donotregisterasglobal){
        if(this.$!==null)return;
        this.$=$(dom);
        this.$.html('<div class="console"><pre class=""></pre></div> ');
        this.$console=this.$.children(".console").children("pre");
        if(donotregisterasglobal==undefined?true:donotregisterasglobal)
            javascool.Webconsole.register(this);
    };
    this.print=function(what) {
        this.$console.append(what);
        var consoleDiv=this.$.children(".console");
        consoleDiv.animate({ scrollTop: consoleDiv.prop("scrollHeight") - consoleDiv.height() }, 0);
    };
    this.clear=function(){
        this.$console.html("");
    };
};
/**
 *
 * @class
 */
javascool.Webconsole={
    /**
     * @inner
     */
    consoles:[],
    print:function(what){
        for(var i=0;i<javascool.Webconsole.consoles.length;i++){
            javascool.Webconsole.consoles[i].print(what);
        }
    },
    clear:function(){
        for(var i=0;i<javascool.Webconsole.consoles.length;i++){
            javascool.Webconsole.consoles[i].clear();
        }
    },
    /**
     * Enregistre une nouvelle console dans le WebConsole de Java's Cool.<br>
     * Une fois enregistré, les sorties de Java's cool seront dirigé vers la console donné en paramètre.
     * @param console La console à enregistrer
     */
    register:function(console){
        javascool.Webconsole.consoles[javascool.Webconsole.consoles.length]=console;
    }
};
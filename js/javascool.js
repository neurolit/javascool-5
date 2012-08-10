/* Java's cool JS Code 
 * © 2012 INRIA
 * © 2012 Philippe VIENNE
 */

/**
 * Javascool Core Function.
 * It helps to create the Java's cool
 */

var jvs = {
    /**
     * Dernier résultat de compilation
     */
    lastCompileResult:null,
    // Global Functions
    fadeFromShortcutsToPanel:function (callback) {
        ShortcutsPaneManager.$.fadeOut(function () {
            $("#SliderPane, #ToolBar").fadeIn("fast", callback);
        });
    },
    fadeFromPanelToShortcuts:function (callback) {
        $("#ToolBar, #SliderPane").fadeOut("fast", function () {
            ShortcutsPaneManager.$.fadeIn("fast", callback);
        });
    },
    compileUserCode:function(){
        EditorTabsManager.compileCurrentFile();
    },
    execUserCode:function(){
        if(this.lastCompileResult==null){
            return;
        }
        if(!this.lastCompileResult.success){
            return;
        }
        var classToRun=this.lastCompileResult.compiledClass;
        $.webjavac("exec",classToRun);
        $("#compileButton, #runButton").attr("disabled",true);
        $("#stopButton").attr("disabled",false);
    },
    haltUserCode:function(){
        $.webjavac("execStop");
        $("#compileButton, #runButton").attr("disabled",false);
        $("#stopButton").attr("disabled",true);
    }
};

function initJVSObjectsAndRunAll() {
    ProgletsManager.init();
    ShortcutsPaneManager.setup();
    ShortcutsPaneManager.$.show();
}

$(document).ready(function () {
    function computeAllSizes() {
        var w = $(window).width(), h = $(window).height();
        $("body").height(h - $("#MenuBar").outerHeight() + "px");
        $("#RightTabsPane, #LeftTabsPane").width(((w/2)-2)+'px');
        $("#splitPart").css({
            position:'absolute',
            left:((w/2)-2)+'px',
            right:((w/2)-2)+'px',
            bottom:0,
            top:0+'px'
        });
    }

    // Setup Resize listeners
    $(window).resize(computeAllSizes);
    // Check now
    computeAllSizes();

    // Add WebJavac for JVS Compilation
    $.webjavac({
        jar:"lib/javascool/webjavac.jar"
    });

    // Setup Listeners from Java
    $(document).bind("java.System.out",function(event,data){
        console.log(data);
        webconsole.print(data);
    });

    $(document).bind("javascool.compiled",function(event,result){
        console.warn("Java's Cool compilation result (debug use)");
        console.warn(result);
        jvs.lastCompileResult=result;
        if(result.success){
            webconsole.print("<i class='icon-ok icon-white'></i> Compilation Réussie");
            $("#runButton").attr("disabled",false);
            $("#stopButton").attr("disabled",true);
        }else{
            $("#runButton, #stopButton").attr("disabled",true);
            webconsole.print("\n--------\n<i class='icon-remove icon-white'></i>  Echec de la compilation (Voir les erreurs affichées ci dessus)");
        }
    });

    $(document).bind("javascool.user.exec.ended",function(event){
        $("#runButton, #compileButton").attr("disabled",false);
        $("#stopButton").attr("disabled",true);
    });

    // Start JVS
    initJVSObjectsAndRunAll();
});

/*
 var jvs=new Object();



 function jvs(){
 jvs.proglets=new Proglets();
 jvs.homePage=new JVSHomePage();
 }

 $(document).ready(function(){
 jvs();
 function computeAllSizes() {
 var w=$(window).width(),h=$(window).height();
 $("body").height((h-40)+"px");
 $("#shortcuts").css("padding","20px "+((w%152)/2)+"px 20px "+((w%152)/2)+"px");
 }
 // Setup Resize listeners
 $(window).resize(computeAllSizes);computeAllSizes();
 });*/

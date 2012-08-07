/* Java's cool JS Code 
 * © 2012 INRIA
 * © 2012 Philippe VIENNE
 */

/**
 * Javascool Core Function.
 * It helps to create the Java's cool
 */

var jvs = {
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
        $("body").height(h + "px");
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
        jar:"libs/javascool/webjavac.jar"
    });

    // Setup Listeners from Java
    $(document).bind("java.System.out",function(event,data){
        console.log(data);
    });

    $(document).bind("javascool.compiled",function(event,result){
        console.log("Compilation result");
        console.log(result);
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

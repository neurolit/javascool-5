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
    fadeFromShortcutsToPanel:function () {
        $("#shortcuts").fadeOut(function () {
            $("body").removeClass("shortcutsBody");
            $("#panel").fadeIn("fast");
            $("#toolbar").fadeIn("fast");
        });
    },
    fadeFromPanelToShortcuts:function () {
        $("#toolbar").hide();
        $("#panel").fadeOut("fast", function () {
            $("body").addClass("shortcutsBody");
            $("#shortcuts").fadeIn("fast");
        });
    }
};

function initJVSObjectsAndRunAll() {
    ProgletsManager.init();
    ProgletsPanel.showShortcutsDiv();
}

$(document).ready(function () {
    function computeAllSizes() {
        var w = $(window).width(), h = $(window).height();
        $("body").height((h - 40) + "px");
        $("#shortcuts").css("padding", "20px " + ((w % 152) / 2) + "px 20px " + ((w % 152) / 2) + "px");

    }

    // Setup Resize listeners
    $(window).resize(computeAllSizes);
    // Check now
    computeAllSizes();
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
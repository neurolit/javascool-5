/* Java's cool JS Code 
 * © 2012 INRIA
 * © 2012 Philippe VIENNE
 */

/**
 * Javascool Core Function.
 * It helps to create the Java's cool
 */
var jvs={
		proglets:null,
		gui:{
			editorTabs:null,
			homePage:null
		},
		fileManager:null,
		compiler:null,
		
		// Global Functions
		fadeFromShortcutsToPanel:function(){
			ProgletsPanel.hideShortcutsDiv(function(){
				$("#panel").fadeIn("fast");
			});
		},
		fadeFromPanelToShortcuts:function(){
			$("#panel").fadeOut("fast",function(){
				$("#shortcuts").fadeIn("fast");
			});
		}
};

function initJVSObjectsAndRunAll(){
	jvs.proglets=new Proglets();
	//jvs.gui.editorTabs=new JVSEditorTabs();
	jvs.gui.homePage=new JVSHomePage();
	jvs.proglets.init();
	jvs.gui.homePage.showShortcutsDiv();
}

$(document).ready(function(){
	function computeAllSizes() {
		var w=$(window).width(),h=$(window).height();
		$("body").height((h-40)+"px");
		$("#shortcuts").css("padding","20px "+((w%152)/2)+"px 20px "+((w%152)/2)+"px");
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
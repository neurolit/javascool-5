function JVSEditorTabs(){
	
}

JVSEditorTabs.prototype={
		editorClass:"JVSEditor",
		openedFiles:new Array(),
		openedEditors:new Array(),
		openFile:function(fileUrl){
			if(typeof fileUrl == "string"){ // Open a file by url
				Console.log("Not implemented");
			}else{ // Open a new File
				
			}
			
		},
		getBaseHTML:function(){
			return "<div id=\"editorTabs\">" +
					"<ul class=\"nav nav-tabs\" id=\"tabsList\"></ul>" +
					"<div class=\"tab-content\" id=\"tabsContent\"></div>" +
					"</div>";
		},
		closeTab:function(file){
			
		},
		setup:function(){
			// On vérifie que le gestionnaire d'éditeurs n'est pas déjà en place
			this.assertIfamIOnScreen();
			// Supprime tout le code qui serai dans le div de la partie gauche
			$('#leftPart').html('');
			// On y ajoute notre code pour la mise en place de l'éditeur
			$('#leftPart').html(this.getBaseHTML());
			// On lance la configuration des écouteurs sur ce gestionnaire
			this.setupListenersOnEditorTabs()
			// On ouvre un premier fichier (TODO:Est-ce que l'on impose à l'utilisateur ce fichier ouvert ?)
			this.openFile();
		},
		setupListenersOnEditorTabs:function(){
			this.assertIfamIOnScreen();
			var myDiv=$("#editorTabs");
			if(myDiv.data('loaded'))
				return;
			myDiv.data('loaded',true);
			myDiv.child('#tabsList > *').click(function(){
				alert('You clicked on a tab');
			});
		},
		amIOnScreen:function(){
			return $("#editorTabs").length>0;
		},
		assertIfamIOnScreen:function(){
			if(!this.amIOnScreen())
				throw "Editor Tabs is not running in HTML code";
		}
};
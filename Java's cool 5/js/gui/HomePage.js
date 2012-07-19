function JVSHomePage(){}

JVSHomePage.prototype={
		/**
		 * Crée les div d'icones pour les proglets chargés.
		 * @private
		 */
		createShortcutsDiv:function(){
			// Create the shortcut div
			$("#shortcuts").html("");
			for (var i=0;i<progletsLoaded.length;i++){
				$("#shortcuts").append(
						"<div class=\"shortcut btn\" id=\"proglet-"+i
						+"-shortcut\" onClick=\"ProgletsPanel.clickEventOnShortcut("+i
						+")\"><div class=\"logo\"><img src=\""+
						progletsLoaded[i].logo+"\"/></div><div class=\"title\"><h3>"+
						progletsLoaded[i].name+"</h3></div></div>");
			}
		},
		/**
		 * Affiche le panneau d'icones.
		 */
		showShortcutsDiv:function(){
			if($("#shortcuts").html()=="")
				this.createShortcutsDiv();
			$("body").addClass("shortcutsBody");
			$("#states > div").fadeOut(null, function(){
				$("#shortcuts").fadeIn("slow");
			});
		},
		/**
		 * Masque le panneau d'icones.
		 * La méthode est asynchrone, la variable callBack permet d'éxecuter un code après le masquage 
		 */
		hideShortcutsDiv:function(callBack){
			$("#shortcuts").fadeOut("fast",function(){
				$("body").removeClass("shortcutsBody");
				if(typeof callBack == "function")callBack();
			});
		},
		/**
		 * Execute les actions lors d'un click sur une icone de proglet
		 * @param i Le numéro de la proglet dans le tableau du ProgletManager ou la proglet elle même.
		 */
		clickEventOnShortcut:function(i){
			if(typeof i != "Proglet"){
				if(progletsLoaded[i]!=undefined)
					i=progletsLoaded[i];
				else
					return;
			}
			progletsManager.start(i);
		}
};

/**
 * Instance général pour la classe de JVSHomePage.
 */
var ProgletsPanel=new JVSHomePage();
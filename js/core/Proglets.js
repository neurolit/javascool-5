function Proglets(){}

var progletsLoaded=new Array();
Proglets.prototype={
		count:function(){
			return 10;
		},
		getArray:function(){
			return progletsLoaded;
		},
		init:function(){
			for(var i=0;i<19;i++){
				this.add(new Proglet());
			}
		},
		add:function(proglet){
			progletsLoaded[progletsLoaded.length]=proglet;
		},
		start:function(proglet){
			try {
				jvs.fadeFromShortcutsToPanel();
				EditorTabsManager.setup();
			} catch (e) {
				console.error("Error : "+e+"Are you in a Java's Cool Environement ?");
			}
		},
		stop:function(){
			try {
				jvs.fadeFromPanelToShortcuts();
				EditorTabsManager.remove();
			} catch (e) {
				console.error("Error : "+e+"Are you in a Java's Cool Environement ?");
			}
		}
};
var ProgletsManager=new Proglets();
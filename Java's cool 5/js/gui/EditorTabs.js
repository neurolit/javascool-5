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
		getHTML:function(){
			
		},
		closeTab:function(file){
			
		}
};
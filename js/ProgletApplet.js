// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}
/**
 * Applet en Pop-Up pour executer les programme des élèves.
 * <p>Cette classe permet de créer une Pop-Up contenant une instance du ProgletApplet du Java's Cool Framework</p>
 * @param {javascool.Proglet} proglet La proglet à afficher dans le ProgletApplet
 * @class
 */
javascool.ProgletApplet=function(proglet) {
    var body=$(document);
//    /if(javascool.ProgletApplet.model==undefined)
        javascool.ProgletApplet.model=javascool.PolyFileWriter.load(javascool.location+"/js/ProgletApplet.html");
    this.openUserProgram=function(program){
        if(javascool.ProgletApplet.openedPopup.closed==false){
            javascool.ProgletApplet.openedPopup.focus();
            return;
        }
        var code=javascool.ProgletApplet.model;
        code=code.replace("@w",400).replace("@h",600).replace("@jars", proglet.hasJar?", proglets/"+proglet.namespace+"/"+proglet.namespace+".jar":"").replace(/@id/g,"ProgPane");
        code=code.replace("@label",proglet.title).replace("@proglet",proglet.hasPanel?"org.javascool.proglets."+proglet.namespace+".Panel":"").replace("@runnable",program);
        code=code.replace("@codebase",".");
        javascool.ProgletApplet.openedPopup=window.open('','name','height=620,width=420');
        var tmp = javascool.ProgletApplet.openedPopup.document;
        tmp.write(code);
        tmp.close();
        javascool.ProgletApplet.openedPopup.focus();
    }
}

javascool.ProgletApplet.openedPopup={
    closed:true
}

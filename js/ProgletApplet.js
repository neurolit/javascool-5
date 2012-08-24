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
        var code=javascool.ProgletApplet.model;
        code=code.replace("@w",400).replace("@h",600).replace("@jars", "proglets/"+proglet.namespace+"/"+proglet.namespace+".jar").replace(/@id/g,"ProgPane");
        code=code.replace("@label",proglet.title).replace("@proglet","org.javascool.proglets."+proglet.namespace+".Panel").replace("@runnable",program);
        console.log(code);
        newwindow2=window.open('','name','height=620,width=420');
        var tmp = newwindow2.document;
        tmp.write(code);
        tmp.close();
    }
}

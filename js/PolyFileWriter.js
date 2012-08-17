// On ajoute les variables javascool si le document est en StandAlone
if (javascool == undefined) {
    javascool = {};
}
/**
 * Instance de l'applet compilateur PolyFileWriter.
 * Il permet d'appeler directement les fonctions de la classe de l'applet. Leur liste est disponible à l'adresse :
 * <a href="http://javascool.github.com/javascool-framework/doc/org/javascool/core/PolyFileWriter.html">org.javascool.core.PolyFileWriter</a>
 * @class
 */
javascool.PolyFileWriter = function(){
    /**
     * L'ID Html de l'applet
     * @inner
     */
    var id="javascool.PolyFileWriter.applet";
    /**
     * L'adresse où se trouve le JAR
     */
    var codeBase="lib/javascool/";
    /**
     * Le nom du fichier du JAR
     */
    var jarName="javascool.jar";
    /**
     * La version minimal de Java pour cette applet.
     * @inner
     */
    var minJavaVersion="1.6";
    
	// On deploie l'Applet
	deployJava.runApplet({
		codebase : codeBase,
		code : 'org.javascool.core.PolyFileWriter',
		archive : jarName,
		id : id,
		width : 1, height : 1, style:"position:absolute;top:-1000px;height:1px;width:1px"
	}, {}, minJavaVersion);
	
	return document.getElementById(id);
}();

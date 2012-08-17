// On ajoute les variables javascool si le document est en StandAlone
if (javascool == undefined) {
    javascool = {};
}
/**
 * Instance de l'applet compilateur WebJavac.
 * Il permet d'appeler directement les fonctions de la classe de l'applet. Leur liste est disponible à l'adresse :
 * <a href="http://javascool.github.com/javascool-framework/doc/org/javascool/core/WebJavac.html">org.javascool.core.WebJavac</a>
 * @class
 */
javascool.WebJavac = function(){
    /**
     * L'ID Html de l'applet
     * @inner
     */
    var id="javascool.WebJavac.applet";
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
		code : 'org.javascool.core.WebJavac',
		archive : jarName,
		id : id,
		width : 1, height : 1, style:"position:absolute;top:-1000px;height:1px;width:1px"
	}, {}, minJavaVersion);
	
	return document.getElementById(id);
}();


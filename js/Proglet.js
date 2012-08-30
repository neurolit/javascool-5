// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}
/**
 * Définit sous la forme d'un objet une Proglet pour JavaScript.
 * <p>Lors de la construction de la proglet, un argument doit être passé et correpond au nom de la proglet.</p>
 * <p>La classe va tenter de charger le fichier ./proglets/&lt; nom &gt;/config.json. Si ce fichier existe alors il va
 * le lire dans le but d'obtenir la configuration de base de la proglet et la liste de ses fichiers. Si le fichier
 * n'existe pas, alors on estimera que la proglet n'est pas installé sur l'ordinateur</p>
 * <p>A la fin du chargement, la Proglet doit s'enregistrer auprès de la classe {@link javascool.Proglets} afin d'être
 * reconnu par le reste de Java's Cool. Mais cela n'empêche pas l'utilisation de cette classe en Stand-Alone.</p>
 * @param {String} [namespace="ABCDAlgo"] Le nom de la proglet à chargé dans le répertoire `proglets`
 * @class
 */
javascool.Proglet=function(namespace) {
    /**
     * Le namespace (ou nom) de la proglet.
     * <p>C'est une sorte d'identifiant respectant les règles de nommage des packages Java. Il permet de différentier
     * deux proglets ayant le même titre.</p>
     * @type {String}
     */
    this.namespace=namespace;
    /**
     * Le titre visuel de la proglet.
     * <p>C'est le nom affiché à l'utilisateur pour cette proglet.</p>
     * @type {String}
     */
    this.title = this.namespace;
    /**
     * Lien vers le logo de la Proglet.
     * @type {String}
     */
    this.logo = "img/proglet.png";
    /**
     * Dit si la proglet contient un Jar à son nom.
     * <p><i>Ex.: <chemin vers la proglet>/<namespace de la proglet>.jar</i><br>
     *     Ce JAR est à inclure lors des compilations et execution.</p>
     * @type {Boolean}
     * @default false
     */
    this.hasJar=false;

    /**
     * Emplacement de la proglet
     * @type {String}
     */
    var location=javascool.location+"/proglets/"+namespace;

    {
        // Chargement de la Proglet
        var config=($.parseJSON(javascool.PolyFileWriter.load(location+"/config.json")));
        var proglet=config.proglet;
        this.logo="proglets/"+namespace+"/"+proglet.icon;
        this.title=proglet.name||this.namespace;
        this.hasJar=javascool.PolyFileWriter.exists(location+"/"+namespace+".jar");
        this.hasHelp=javascool.PolyFileWriter.exists(location+"/help.html");
        this.hasPanel=config.hasPanel;
    }
    
    /**
     * Compile le code JVS avec les librairies de la proglet
     */
    this.compile=function(code){
        var compiler=javascool.WebJavac;
        if(compiler==null)return;
        code=code||"";
        var 
            libs=[
                javascool.location+"/lib/javascool/javascool.jar",
                javascool.location+"/proglets/"+this.namespace+"/"+this.namespace+".jar"
            ],
            progletConf={
                name:this.namespace,
                jar:libs[1],
                hasFunctions: config.hasFunctions,
                hasTranslator: config.hasTranslator
            };
        console.log("Start compile : ",libs,progletConf)
        compiler.compile(code,JSON.stringify(libs),JSON.stringify(progletConf));
    };
}
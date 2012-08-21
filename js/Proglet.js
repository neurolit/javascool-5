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
 * <p><i>NB : La fonction utilisé pour le chargement est {@link jQuery.getJSON}, ce qui fait que cette classe est
 * prête pour tourner sur un site web en ligne</i></p>
 * @param {String} [namespace="ABCDAlgo"] Le nom de la proglet à chargé dans le répertoire `proglets`
 * @class
 */
javascool.Proglet=function(namespace) {
    /**
     * Le namespace (ou nom) de la proglet.
     * <p>C'est une sorte d'identifiant respectant les règles de nommage des packages Java. Il permet de différentier
     * deux proglets ayant le même titre.</p>
     * @type {String}
     * @private
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
     * Emplacement de la proglet
     * @type {String}
     */
    var location=javascool.location+"/proglets/"+namespace;

    {
        // Chargement de la Proglet
        var proglet=($.parseJSON(javascool.PolyFileWriter.load(location+"/proglet.json")));
        this.logo="proglets/"+namespace+"/"+proglet.icon;
        this.title=proglet.name||this.namespace;
    }
}
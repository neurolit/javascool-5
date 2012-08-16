// On ajoute les variables javascool si le document est en StandAlone
if(javascool==undefined){
    javascool={};
}
/**
 * Définit sous la forme d'un objet une Proglet pour JavaScript.
 * C'est pour l'instant une fausse proglet
 * @param {String} [namespace="ABCDAlgo"] Le namespace de la proglet à chargé
 * @class
 */
javascool.Proglet=function(namespace) { // Create an object Proglet
    this.name = "ABCDAlgo";
    this.logo = "img/proglet.png";
}
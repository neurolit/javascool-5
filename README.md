# Java's Cool 5

Le projet est désormais un projet construit en Java à partir d'une architecture [Maven](https://maven.apache.org/). 
Ce projet dépend du *javascool-core* qui est la bibliothèque minimale de Java's Cool.

La version Web de Java's Cool est pour l'instant abandonnée à cause du modèle de sécurité de Java sur la plate-forme client.

Le développement de Java's Cool 5 commence et a pour objectif d'implémenter toutes les demandes en attente :

* de l'HTML5 pour l'affichage de la documentation ;
* des *proglets* qui ne font pas du Java (exemple : [IOI](http://www.france-ioi.org/)) ;
* la possibilité d'avoir un *debugger* ;
* l'export vers des formats différents pour que l'élève puisse transporter son programme sur un ordinateur n'hébergeant pas Java's Cool ;
* un système de dépendances qui se rapprocherait d'Eclipse et qui permettrait aux *proglets* d'utiliser des bibliothèques natives ;
* l'arrivée de [Maven](https://maven.apache.org/) comme standard de projet pour les *proglets*, ce qui facilitera le processus de validation des *proglets* et donc l'ouverture plus rapide à une communauté de développeurs ;
* utilisation de `org.eclipse.jdt.core` pour le compilateur et la gestion de code Java.

## Contact

http://javascool.github.com/wpages/contact.html pour toute demande

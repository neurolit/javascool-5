# Java's Cool 5
Ce dépot et ce readme sont à destination des développeurs internes de JVS (Java's Cool) afin d'expliquer le fonctionnement de ces derniers.
## L'organisation des dossiers
A l'origine du dépot, vous trouvez un index.html. Ce dernier est le point d'entré de l'application. Ensuite, on retrouve
différents répertoires :
* img : Il est chargé de conserver les images necessaire à l'application (hormis ceux des librairies)
* libs : Il contient toutes les librairies CSS et JS necessaire à l'application.
* js : Ce dossier est le point le plus important car il contient tous le code JavaScript de JVS.
    * Les partie de l'application necessaire mais non graphiques (ex.: Gestion des proglets, Accès aux fichiers ...)
    * Tous les codes à visé graphique (ex.: Gestionnaire des Onglets d'Edition)

## Tâches du MakeFile
* doc : Construit (ou met à jour) la doc de Java's Cool 5 et l'affiche dans Firefox
* publishDoc : Permet de publier la documentation en ligne (La crée au besoin)
* gweb : Ouvre Java's Cool 5 dans Google® Chrome® avec un profil dédié
* fweb : Ouvre Java's Cool 5 dans Mozilla® Firefox avec un profil dédié
* clean : Nettoie tous les fichiers temporaire de Java's Cool (5 et framework)
* lib/javascool/javascool.jar : Construit la librairie minimal pour Java's Cool depuis le framework

## Contacte
http://javascool.github.com/wpages/contact.html pour toute demande

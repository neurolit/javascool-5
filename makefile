#
#		Makefile pour Java's Cool 5
#

#####################################################################################################################################
# Tâches globales (à mettre dans un makefile commun)

usage :
	@grep '^#::' makefile | sed 's/^#:://'

what :
	@grep '^#:' makefile | sed 's/^#:://' | sed 's/^#://'

#####################################################################################################################################
# Répertoires de Java's Cool

JAVASCOOL_Framework_Folder ?= $(shell find ${PWD}/.. -type d -name javascool-framework)
ifeq ($(JAVASCOOL_Framework_Folder),)
$(error Le répertoire ../javascool-framework n´est pas intallé)
endif
JAVASCOOL_5 = ${PWD}

#####################################################################################################################################
# Lancement de l'application Java's Cool

fweb: lib/javascool/javascool.jar
	firefox file://${PWD}/index.html

BROWSER_PROFILE ?= ${PWD}/.tmp

gweb: lib/javascool/javascool.jar
	google-chrome --allow-outdated-plugins --user-data-dir=$(BROWSER_PROFILE) file://${PWD}/index.html

#####################################################################################################################################
# Construction des librairies de Java's Cool 

lib/javascool/javascool.jar : $(wildcard ../javascool-framework/js/*.js) $(wildcard ../javascool-framework/src/org/javascool/*/*.java)
	@$(MAKE) -C $(JAVASCOOL_Framework_Folder) all
	@cp  $(JAVASCOOL_Framework_Folder)/{*.jar,js/jquery.*.js} ./lib/javascool

clean:
	@rm -rf lib/javascool/* ${DOC_FOLDER} .gh-pages
	@$(MAKE) -C $(JAVASCOOL_Framework_Folder) clean

#####################################################################################################################################
# Construction des docs javascript de l'application Web

DOC_FOLDER ?= ${PWD}/.doc

JS_SOURCE ?= ${PWD}/js

${DOC_FOLDER}/doc : $(wildcard ../javascool-framework/js/*.js)
	@echo "Création de la documentation de Java's Cool 5"
	@mkdir -p $@
	@$(JAVASCOOL_Framework_Folder)/lib/jsdoc-builder.sh ${JS_SOURCE} $@

doc : ${DOC_FOLDER}/doc
	@firefox $</index.html
	@echo "Documentation local mise à jour et ouverte dans Firefox"

gh_url = $(shell grep 'url =' .git/config | sed 's/[ \t]*url = //')

publishDoc : ${DOC_FOLDER}/doc
	@$(JAVASCOOL_Framework_Folder)/lib/gh-pages-publish.sh ${DOC_FOLDER} ${gh_url}
	@echo "Documentation en ligne mise à jour !"

#####################################################################################################################################

#: ********************************************************************************
#: *****     Lisez moi pour les développeurs JavaScool developer's readme     *****
#: ********************************************************************************
#:
#: Bienvenu dans le Makefile pour le développement de Java's Cool 5
#:  Contactez PhilippeGeek@gmail.com ou thierry.vieville@inria.fr pour toute demande
#:
#:
#:: USAGE :
#::     doc        : Construit (ou met à jour) la doc de Java's Cool 5 et l'affiche 
#::                  dans Firefox
#::     publishDoc : Permet de publier la documentation en ligne (La crée au besoin)
#::     gweb       : Ouvre Java's Cool 5 dans Google® Chrome® avec un profil dédié
#::     fweb       : Ouvre Java's Cool 5 dans Mozilla® Firefox avec un profil dédié
#::     clean      : Nettoie tous les fichiers temporaire de Java's Cool (5 et framework)
#::     lib/javascool/javascool.jar :
#::                  Construit la librairie minimal pour Java's Cool depuis le framework


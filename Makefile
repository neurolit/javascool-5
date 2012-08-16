#
#		Makefile pour Java's Cool 5
#

# Répertoires de Java's Cool 
JAVASCOOL_Framework_Folder ?= $(shell find ${PWD}/.. -type d -name javascool-framework)
ifeq ($(JAVASCOOL_Framework_Folder),)
$(error Le répertoire ../javascool-framework n´est pas intallé)
endif
JAVASCOOL_5 = ${PWD}

# Lancement de l'application Java's Cool

fweb: lib/javascool/javascool.jar
	firefox index.html

BROWSER_PROFILE ?= ${PWD}/.tmp

gweb: lib/javascool/javascool.jar
	google-chrome --allow-outdated-plugins --user-data-dir=$(BROWSER_PROFILE) file://${PWD}/index.html

# Construction des librairies de Java's Cool 

lib/javascool/javascool.jar : $(wildcard ../javascool-framework/js/*.js) $(wildcard ../javascool-framework/src/org/javascool/*/*.java)
	@$(MAKE) -C $(JAVASCOOL_Framework_Folder) all
	@cp  $(JAVASCOOL_Framework_Folder)/{*.jar,js/jquery.*.js} ./lib/javascool

clean:
	@rm -rf lib/javascool/* ${DOC_FOLDER} .gh-pages
	@$(MAKE) -C $(JAVASCOOL_Framework_Folder) clean

# Construction des docs javascript de l'application Web

DOC_FOLDER ?= .doc

JS_SOURCE ?= ${PWD}/js

${DOC_FOLDER} :
	@mkdir -p ${DOC_FOLDER}

${DOC_FOLDER}/jsdoc : ${DOC_FOLDER}
	@rm -rf $@
	@echo "Clonage de JSDoc 2.4 (Dernière version stable) pour générer la doc"
	@svn checkout -q http://jsdoc-toolkit.googlecode.com/svn/tags/jsdoc_toolkit-2.4.0/jsdoc-toolkit/ $@
	@rm -rf $(shell find $@ -name ".svn")
	@echo "Clonage du theme bootstrap pour JSDoc2"
	@git clone -q git://github.com/OrgaChem/JsDoc2-Template-Bootstrap.git $@/templates/bootstrap
	@rm -rf $@/templates/bootstrap/.git
	@chmod 777 "$@/jsrun.sh"

${DOC_FOLDER}/doc : ${DOC_FOLDER}/jsdoc
	@echo "Génération de la documentation de Java's Cool 5"
	@mkdir -p $@
	@cd $<; ./jsrun.sh -r -a -t=templates/bootstrap -d=${JAVASCOOL_5}/$@ ${JS_SOURCE}

doc : ${DOC_FOLDER}/doc
	@firefox $</index.html

gh_pages_GIT_REF = origin gh-pages

.gh-pages :
	@git clone -q git@github.com:javascool/javascool-5.git $@; cd $@; git checkout --orphan gh-pages; git rm -q -rf .; git pull ${gh_pages_GIT_REF}

publishDoc : .gh-pages ${DOC_FOLDER}/doc
	@cd ${JAVASCOOL_5}/.gh-pages; git pull ${gh_pages_GIT_REF}
	@cp -r ${DOC_FOLDER}/doc ${JAVASCOOL_5}/.gh-pages
	@cd ${JAVASCOOL_5}/.gh-pages ; git add -A ; git commit -m "Mise à jour de la documentation" ; git push ${gh_pages_GIT_REF}



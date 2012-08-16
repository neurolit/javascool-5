
ifeq ($(shell find .. -name javascool-framework),)
ifdef JVS_Framework_Folder
$(warning Please try to be in a JVS Dev folder scheme (see README.md))
else
$(error You are not in a JVS Dev folder scheme and JVS_Framework_Folder is not defined)
endif
endif

JVS_Framework_Folder?=$(shell find .. -name javascool-framework)
JAVASCOOL_5=${PWD}
BROWSER?=firefox
BROWSER_PROFILE?=${PWD}/.tmp

clean:
	@rm -f lib/javascool/*

installJavascoolLibraries:
# Build jars from JVS_Framework_Folder
	@ cd $(JVS_Framework_Folder) && $(MAKE) jarAndJavaScriptForJavascool5
# Copy built JARs
	@ cp $(JVS_Framework_Folder)/*.jar ./lib/javascool
# Copy built JS files
	@ cp $(JVS_Framework_Folder)/js/jquery.*.js ./lib/javascool

web:
#	@rm -rf ${BROWSER_PROFILE}
	google-chrome --allow-outdated-plugins --user-data-dir=$(BROWSER_PROFILE) file://${PWD}/index.html

DOC_FOLDER?=.doc
JS_SOURCE?=${PWD}/js

clean_docs:
	@rm -rf ${DOC_FOLDER};

${DOC_FOLDER}:
	@mkdir -p ${DOC_FOLDER};

${DOC_FOLDER}/jsdoc: ${DOC_FOLDER}
	@rm -rf $@;
	@echo "Clonage de JSDoc 2.4 (Dernière version stable) pour générer la doc";
	@svn checkout -q http://jsdoc-toolkit.googlecode.com/svn/tags/jsdoc_toolkit-2.4.0/jsdoc-toolkit/ $@;
	@rm -rf $(shell find $@ -name ".svn");
	@echo "Clonage du theme bootstrap pour JSDoc2";
	@git clone -q git://github.com/OrgaChem/JsDoc2-Template-Bootstrap.git $@/templates/bootstrap;
	@rm -rf $@/templates/bootstrap/.git;
	@chmod 777 "$@/jsrun.sh";

${DOC_FOLDER}/doc: ${DOC_FOLDER}/jsdoc
	@echo "Génération de la documentation de Java's Cool 5";
	@mkdir -p $@;
	@cd $<; ./jsrun.sh -r -a -t=templates/bootstrap -d=${JAVASCOOL_5}/$@ ${JS_SOURCE};

doc:${DOC_FOLDER}/doc
	@firefox $</index.html

gh_pages_GIT_REF=origin gh-pages

.gh-pages:
	@git clone -q git@github.com:javascool/javascool-5.git $@; cd $@; git checkout --orphan gh-pages; git rm -q -rf .; git pull ${gh_pages_GIT_REF};

publishDoc: .gh-pages ${DOC_FOLDER}/doc
	@cd ${JAVASCOOL_5}/.gh-pages; git pull ${gh_pages_GIT_REF};
	@cp -r ${DOC_FOLDER}/doc ${JAVASCOOL_5}/.gh-pages
	@cd ${JAVASCOOL_5}/.gh-pages; git add -A; git commit -m "Mise à jour de la documentation"; git push ${gh_pages_GIT_REF};


############################################################################################################################
#		Makefile for Java's Cool 5
############################################################################################################################
## Usage :
##  make fweb          : lance l'appli pour firefox
##  make gweb          : lance l'appli pour google-chrome
##  make doc           : crée, publie et affiche la documentation du logiciel en local sous firefox

# Lancement de l'application Java's Cool

fweb: lib/javascool/javascool.jar
	firefox file://${PWD}/index.html

gweb: lib/javascool/javascool.jar
	google-chrome --allow-outdated-plugins --user-data-dir=${PWD}/.tmp file://${PWD}/index.html

# Construction de la librairie de Java's Cool 

lib/javascool/javascool.jar : $(wildcard ../javascool-framework/js/*.js) $(wildcard ../javascool-framework/src/org/javascool/*/*.java)
	@$(MAKE) -C ../javascool-framework jar
	@mkdir -p lib/javascool
	@cp  ../javascool-framework/*.jar ./lib/javascool

clean:
	@rm -rf lib/javascool/javascool.jar doc proglets/*

# Construction des docs javascript de l'application Web

gh_url = $(shell grep 'url =' .git/config | sed 's/[ \t]*url = //')

doc :
	@../javascool-framework/lib/jsdoc-builder.sh ${PWD}/js ${PWD}/$@
	@../javascool-framework/lib/gh-pages-publish.sh $@ ${gh_url}
	@firefox http://javascool.github.com/javascool-5/doc

proglets/proglets.json : $(wildcard proglets/*/*.json)
	.lib/proglets-json.sh;


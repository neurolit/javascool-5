
###    Makefile pour Java's Cool 5


# Lancement de l'application Java's Cool

fweb: lib/javascool/javascool.jar
	firefox file://${PWD}/index.html

gweb: lib/javascool/javascool.jar
	google-chrome --allow-outdated-plugins --user-data-dir=${PWD}/.tmp file://${PWD}/index.html

# Construction de la librairie de Java's Cool 

lib/javascool/javascool.jar : $(wildcard ../javascool-framework/js/*.js) $(wildcard ../javascool-framework/src/org/javascool/*/*.java)
	@$(MAKE) -C ../javascool-framework jar
	@cp  $(JAVASCOOL_Framework_Folder)/*.jar ./lib/javascool

clean:
	@rm -rf lib/javascool/javascool.jar doc

# Construction des docs javascript de l'application Web

gh_url = $(shell grep 'url =' .git/config | sed 's/[ \t]*url = //')

doc :
	@../javascool-framework/lib/jsdoc-builder.sh src ${PWD}/js $@
	@../javascool-framework/lib/gh-pages-publish.sh $@ ${gh_url}
	@firefox http://javascool.github.com/javascool-5/doc



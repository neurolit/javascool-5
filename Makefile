
ifeq ($(shell find .. -name javascool-framework),)
ifdef JVS_Framework_Folder
$(warning Please try to be in a JVS Dev folder scheme (see README.md))
else
$(error You are not in a JVS Dev folder scheme and JVS_Framework_Folder is not defined)
endif
endif

JVS_Framework_Folder?=$(shell find .. -name javascool-framework)
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




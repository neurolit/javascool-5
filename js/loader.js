requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl:'libs',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths:{
        js:'../js',
        core:'../js/core',
        gui:'../js/gui'
    }
});

// Start the main app logic.
requirejs(['jquery/jquery-1.7.2', 'bootstrap/js/bootstrap', 'js/javascool', 'core/JVSFile', 'core/Proglet', 'core/Proglets', 'gui/EditorTabs', 'gui/HomePage'],
    function () {
    });
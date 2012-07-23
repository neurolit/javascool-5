function Proglet() { // Create an object Proglet
    this.name = "ABCDAlgo";
    this.logo = "img/proglet.png";
}

Proglet.prototype = {
    load:function (name) {
        $.javascool.proglets.addProgletToWall(this);
    }
};
/**
 * User: pvienne
 * Date: 7/23/12
 * Time: 4:30 PM
 */
function JVSTabs(domElem) {
    this.$ = $(domElem);
    this.$.addClass("jvstable");
    this.$.html('<ul class="nav nav-tabs"></ul><div class="tab-content"></div>');
}
JVSTabs.prototype = {
    addTab:function (title, content) {

    },
    removeTab:function (id) {

    },
    count:function () {
        return this.$.children(".nav-tabs").children().length();
    }
};
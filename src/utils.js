(function (root) {
    var utils = {};

    var CabalProperty = function (name) {
        this.name = name;
        this.componentType = 'span';
    };

    CabalProperty.prototype.attributes = function (attributeMap) {
        this.attr = attributeMap;
        return this;
    };

    CabalProperty.prototype.as = function (type) {
        if (type === undefined || type === null)
            throw new Error("PropertyMapping's componentType can't be undefined or null");
        this.componentType = type;
        return this;
    };

    utils.mapper = function (name) {
        var p = new CabalProperty(name);
        return p;
    };

    if (typeof root.cabalutils === 'undefined')
        root.cabalutils = utils;

})(this);

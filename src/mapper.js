(function (cabal) {
    var mod = {};

    var CabalProperty = function (name) {
        this.name = name;
        this.componentType = 'Text';
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

    CabalProperty.prototype.react = function (tag) {
        this.componentType = 'react';
        this.element = tag;
        return this;
    };

    mod.property = function (name) {
        var p = new CabalProperty(name);
        return p;
    };

    mod.extend = function (name, fn) {
        if (typeof(fn) !== 'function')
            throw (new Error("Extensions must be functions."));
        if (CabalProperty.prototype[name] !== undefined)
            throw (new Error("Overriding properties or methods is not allowed."));
        CabalProperty.prototype[name] = fn;
        return fn;
    };

    cabal.mapper = mod;
})(cabal);

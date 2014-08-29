(function (cabal) {
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

    var mapper = function (name) {
        var p = new CabalProperty(name);
        return p;
    };

    if (typeof(cabal.mapper) === 'undefined') {
        cabal.mapper = mapper;
    }
})(this.cabal);

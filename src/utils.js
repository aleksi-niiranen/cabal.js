(function (cabal) {
    var utils = {},
        comp = cabal.component;

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

    utils.getComponent = function (name) {
        var c = comp(name);
        if (c === undefined)
            return React.DOM[name];
        return c;
    };

    utils.mapToRow = function (rowData, component) {
        if (!rowData) return [];
        var row = rowData.map(function (current) {
            return (utils.getComponent(component)({}, utils.getComponent(current.type)(current.inputs)));
        });
        return row;
    };

    utils.mapToRows = function (rowsData, component) {
        if (!rowsData) return [];
        var rows = rowsData.map(function (current) {
            return utils.getComponent(component)({rowData: current});
        });
        return rows;
    };

    utils.mapToListItems = function (itemsData) {
        if (!itemsData.data) return [];
        var items = itemsData.data.map(function (current) {
            return (React.DOM.li({}, utils.mapToListItem(current, itemsData.headers)));
        });
        return items;
    };

    utils.mapToListItem = function (itemData, labels) {
        if (!itemData) return [];
        var totalLength = itemData.length - 1;
        var item = itemData.map(function (current, index) {
            var isLast = totalLength === index;
            return React.DOM.span({},
                                  [(labels ? utils.getComponent(labels[index].type)(labels[index].inputs) : undefined),
                                  utils.getComponent(current.type)(current.inputs),
                                  (!isLast ? React.DOM.br({}) : undefined)]);
        });
        return item;
    };

    if (typeof(cabal.utils) === 'undefined')
        cabal.utils = utils;

})(this.cabal);

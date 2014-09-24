(function (root) {
    var Cabal = function (columnMappings) {
        return function (renderer, result) {
            var data = preRender(columnMappings.properties, result);
            renderer(data, columnMappings.headers);
        };
    };

    var sortRenderedProperties = function (properties) {
        var sorted = properties.sort(function (a, b) {
            return a.ri - b.ri;
        });
        return sorted;
    };

    var preRender = function (mappings, result) {
        var data = [];

        var properties = result[0].Cells.results.reduce(function (p, c, i) {
            var renderingIndex = mappings.propertiesToRender.indexOf(c.Key);
            if (renderingIndex > -1)
                p.rendered.push({ ri: renderingIndex, pi: i });
            p.all[c.Key] = i;
            return p;
        }, { rendered: [], all: {} });

        properties.rendered = sortRenderedProperties(properties.rendered);

        result.forEach(function (row) {
            data.push(rowRenderer(properties, row.Cells.results, mappings));
        });
        return data;
    };

    var mapProperty = function (property, index, array) {
        return function (data, propertyIndexes, allPropertyIndexes) {
            var value = property.children === undefined ? data[propertyIndexes.pi].Value : property.children;
            var inputs = traverseAttributes(property.attr, data, allPropertyIndexes);
            inputs.children = value;
            return { type: property.componentType, inputs: inputs };
        }
    };

    var isCabalProperty = function (prop) {
        if (typeof prop.componentType === 'string' && typeof prop.name === 'string')
            return true;
        return false;
    };

    var traverseAttributes = function (attr, data, indexes) {
        var trAttr = {};
        for (var key in attr) {
            var value = attr[key];
            if(isCabalProperty(value))
                trAttr[key] = data[indexes[value.name]].Value;
            else
                trAttr[key] = value;
        }
        return trAttr;
    };

    var rowRenderer = function (propertyInformation, data, mappings) {
        var row = propertyInformation.rendered.map(function (current, index) {
            return mappings.rowTemplate[current.ri](data, current, propertyInformation.all);
        });
        return row;
    };

    var cabal = function (properties, headers) {
        return Cabal({ properties: propertyTransformer(properties),
                       headers: headerTransformer(headers) });
    };

    cabal.VERSION = "0.3.0";

    var headerTransformer = function (headers) {
        var transformed = headers.map(function (title) {
            return { inputs: { children: title } };
        });
        return transformed;
    };

    var propertyTransformer = function (properties) {
        var transform = {};
        transform.propertiesToRender = properties.map(function (property) {
            return property.name;
        });
        transform.rowTemplate = properties.map(mapProperty);
        return transform;
    };

    if (typeof root.cabal === 'undefined')
        root.cabal = cabal;
})(this);

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

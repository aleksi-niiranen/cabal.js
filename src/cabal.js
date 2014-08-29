/**
 * Requires IE9 or later
 */
(function (root) {
    var Cabal = function (columnMappings, component) {
        var cm = columnMappings,
            c = component;

        if (c.isContainer === undefined || c.isContainer === false) {
            throw (new Error("Component must be a container."));
        }

        return function (result, parent) {
            var data = preRender(cm.properties, result);
            React.renderComponent(c({ headers: cm.headers, data: data }), parent);
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
            if (renderingIndex > -1) {
                p.rendered.push({ ri: renderingIndex, pi: i });
            }
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
            return { type: property.componentType, element: property.element, inputs: inputs };
        }
    };

    var traverseAttributes = function (attr, data, indexes) {
        var cstr = cabal.mapper().constructor;
        var trAttr = {};
        for (var key in attr) {
            var value = attr[key];
            if(value instanceof cstr) {
                trAttr[key] = data[indexes[value.name]].Value;
            } else {
                trAttr[key] = value;
            }
        }
        return trAttr;
    };

    var rowRenderer = function (propertyInformation, data, mappings) {
        var row = propertyInformation.rendered.map(function (current, index) {
            return mappings.rowTemplate[current.ri](data, current, propertyInformation.all);
        });
        return row;
    };

    var cabal = function (columnMappings, component) {
        return Cabal(columnMappings, component);
    };

    cabal.VERSION = "0.2.0";

    cabal.Headers = function (columns, type, fn) {
        var headers = columns.map(function (column) {
            return { type: type, 
                inputs: { children: column } };
        });
        return headers;
    };

    cabal.Properties = function (properties) {
        var propertyMap = {};
        propertyMap.propertiesToRender = properties.map(function (property) {
            return property.name;
        });
        propertyMap.rowTemplate = properties.map(mapProperty);
        return propertyMap;
    };

    if (typeof(root.cabal) === 'undefined') {
        root.cabal = cabal;
    }
})(this);

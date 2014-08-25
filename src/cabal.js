/**
 * Requires IE9 or later
 */
(function (root) {
    var Cabal = function (columnMappings, component) {
        var cm = columnMappings,
            c = component;

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
        var properties = { rendered: [], all: {}, sorted: false };
        result.forEach(function (row) {
            if (mappings.propertiesToRender.length === 0) {
                data.push(rowRenderer(properties, row.Cells.results, mappings));
                return;
            }
            row.Cells.results.forEach(function (mp, index) {
                var renderingIndex = mappings.propertiesToRender.indexOf(mp.Key);
                if (renderingIndex > -1) {
                    properties.rendered.push({ ri: renderingIndex, pi: index});
                    mappings.propertiesToRender.splice(renderingIndex, 1, null);
                }
                properties.all[mp.Key] = index;
            });
            mappings.propertiesToRender.forEach(function (property, index) {
                if (property !== null) properties.rendered.push({ ri: index });
            });
            properties.rendered = sortRenderedProperties(properties.rendered);
            data.push(rowRenderer(properties, row.Cells.results, mappings));
            mappings.propertiesToRender = [];
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
        var cstr = cabal.mapper.property().constructor;
        var trAttr = {};
        // TODO: switch to Object.keys?
        for (var key in attr) {
            var value = attr[key];
            if(value instanceof cstr) {
                trAttr[key] = data[indexes[value.name]].Value;
            } else
                trAttr[key] = value;
        }
        return trAttr;
    };

    var rowRenderer = function (propertyInformation, data, mappings, sort) {
        var row = propertyInformation.rendered.map(function (current, index) {
            return mappings.rowTemplate[current.ri](data, current, propertyInformation.all);
        });
        return row;
    };

    var cabal = function cabal (columnMappings, component) {
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

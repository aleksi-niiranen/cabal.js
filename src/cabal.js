/**
 * Requires IE9 or later
 */
(function (root) {
    var cabal = {};
    cabal.VERSION = "0.1.0";

    var app = function (result) {
        this.result = result;
    };

    app.prototype.preRender = function (mappings) {
        var data = [];
        var properties = { rendered: [], all: {} };
        this.result.forEach(function (row) {
            if (mappings.propertiesToRender.length === 0) {
                data.push(rowRenderer(properties, row, mappings));
                return;
            }
            row.forEach(function (mp, index) {
                var renderingIndex = mappings.propertiesToRender.indexOf(mp.Name);
                if (renderingIndex > -1) {
                    properties.rendered.push({ ri: renderingIndex, pi: index});
                    mappings.propertiesToRender.splice(renderingIndex, 1, null);
                }
                properties.all[mp.Name] = index;
            });
            mappings.propertiesToRender.forEach(function (property, index) {
                if (property !== null) properties.rendered.push({ ri: index });
            });
            data.push(rowRenderer(properties, row, mappings));
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

    var rowRenderer = function (propertyInformation, data, mappings) {
        // seriously unoptimized
        // we only want to sort once
        // now we sort once for every row
        var rendered = propertyInformation.rendered.sort(function (a, b) {
            return a.ri - b.ri;
        });
        var row = rendered.map(function (current, index) {
            return mappings.rowTemplate[current.ri](data, current, propertyInformation.all);
        });
        return row;
    };

    cabal.TableColumnHeaders = function (columns) {
        var headers = columns.map(function (column) {
            return { type: 'HeaderColumn', inputs: { children: column } };
        });
        return headers;
    };

    cabal.ListItemLabels = function (columns) {
        var labels = columns.map(function (column) {
            return { type: 'ItemLabel', inputs: { children: column + ": " } };
        });
        return labels;
    };

    cabal.Properties = function (properties) {
        var propertyMap = {};
        propertyMap.propertiesToRender = properties.map(function (property) {
            return property.name;
        });
        propertyMap.rowTemplate = properties.map(mapProperty);
        return propertyMap;
    };

    cabal.app = function (result) {
        return new app(result);
    };

    app.prototype.Table = function (columnMappings, parent) {
        var data = this.preRender(columnMappings.properties);
        React.renderComponent(
            cabal.components.Table({ headers: columnMappings.headers, data: data }), parent);
    };

    app.prototype.List = function (columnMappings, parent) {
        var data = this.preRender(columnMappings.properties);
        React.renderComponent(
            cabal.components.List({ labels: columnMappings.labels, data: data }), parent);
    };

    if (typeof(root.cabal) === 'undefined') {
        root.cabal = cabal;
    }
})(this);

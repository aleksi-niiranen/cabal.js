/**
 * Requires IE9 or later
 */
var cabal = (function () {
    var mod = {};
    mod.VERSION = "0.1.0";

    var app = function (result) {
        this.result = result;
    };

    app.prototype.preRender = function () {
        var mappings = columnMappings.properties;
        var data = [];
        var properties = { rendered: [], all: {} };
        _.each(this.result, function (row) {
            if (mappings.propertiesToRender.length === 0) {
                data.push(rowRenderer(properties, row, mappings));
                return;
            }
            _.each(row, function (mp, index) {
                var renderingIndex = mappings.propertiesToRender.indexOf(mp.Name);
                if (renderingIndex > -1) {
                    properties.rendered.push({ ri: renderingIndex, pi: index});
                    mappings.propertiesToRender.splice(renderingIndex, 1, null);
                }
                properties.all[mp.Name] = index;
            });
            _.each(mappings.propertiesToRender, function (property, index) {
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
        _.each(attr, function (value, key) {
            if(value instanceof cstr) {
                trAttr[key] = data[indexes[value.name]].Value;
            } else
                trAttr[key] = value;
        });
        return trAttr;
    };

    var rowRenderer = function (propertyInformation, data, mappings) {
        // seriously unoptimized
        // we only want to sort once
        // now we sort once for every row
        var rendered = propertyInformation.rendered.sort(function (a, b) {
            return a.ri - b.ri;
        });
        var row = _.map(rendered, function (current, index) {
            return mappings.rowTemplate[current.ri](data, current, propertyInformation.all);
        });
        return row;
    };

    mod.TableColumnHeaders = function (columns) {
        var headers = _.map(columns, function (column) {
            return { type: 'HeaderColumn', inputs: { children: column } };
        });
        return headers;
    };


    mod.Properties = function (properties) {
        var propertyMap = {};
        propertyMap.propertiesToRender = _.map(properties, function (property) {
            return property.name;
        });
        propertyMap.rowTemplate = _.map(properties, mapProperty);
        return propertyMap;
    };

    mod.Table = function (columnMappings, result, parent) {
        var mappings = columnMappings.properties;
        var data = [];
        var properties = { rendered: [], all: {} };
        _.each(result, function (row) {
            if (mappings.propertiesToRender.length === 0) {
                data.push(rowRenderer(properties, row, mappings));
                return;
            }
            _.each(row, function (mp, index) {
                var renderingIndex = mappings.propertiesToRender.indexOf(mp.Name);
                if (renderingIndex > -1) {
                    properties.rendered.push({ ri: renderingIndex, pi: index});
                    mappings.propertiesToRender.splice(renderingIndex, 1, null);
                }
                properties.all[mp.Name] = index;
            });
            _.each(mappings.propertiesToRender, function (property, index) {
                if (property !== null) properties.rendered.push({ ri: index });
            });
            data.push(rowRenderer(properties, row, mappings));
            mappings.propertiesToRender = [];
        });

        React.renderComponent(
            cabal.components.Table({ headers: columnMappings.headers, data: data }),
            parent
        );
    };

    mod.People = function (columnMappings, result, parent) {
        var mappings = columnMappings.properties;
        var data = [];
        var properties = { rendered: [], all: {} };
        _.each(result, function (row) {
            if (mappings.propertiesToRender.length === 0) {
                data.push(rowRenderer(properties, row, mappings));
                return;
            }
            _.each(row, function (mp, index) {
                var renderingIndex = mappings.propertiesToRender.indexOf(mp.Name);
                if (renderingIndex > -1) {
                    properties.rendered.push({ ri: renderingIndex, pi: index});
                    mappings.propertiesToRender.splice(renderingIndex, 1, null);
                }
            });
        });

        React.renderComponent(
            cabal.components.Container({ data: data }),
            parent
        );
    };

    return mod;
})();

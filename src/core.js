(function (root) {
    var Cabal = function (columnMappings) {
        var isPrerendered = false;
        var done = function () {
            isPrerendered = true;
        };
        var render = function render (renderer, result) {
            var data = preRender(columnMappings.properties, result, done);
            renderer(data, columnMappings.headers);
        };
        Object.defineProperty(render, "isPrerendered", {
            enumerable: true,
            get: function () { return isPrerendered; }
        });
        return render;
    };

    var sortRenderedProperties = function (properties) {
        var sorted = properties.sort(function (a, b) {
            return a.ri - b.ri;
        });
        return sorted;
    };

    var preRender = function (mappings, result, done) {
        var data = [];

        if (result.length > 0) {
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
        }
        done();
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

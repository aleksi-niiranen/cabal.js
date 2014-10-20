(function (root) {
    var Cabal = function (columnMappings) {
        return render(columnMappings);
    };

    var sortRenderedProperties = function (properties) {
        var sorted = properties.sort(function (a, b) {
            return a.ri - b.ri;
        });
        return sorted;
    };

    var render = function (colMap) {
        var _renderable = false, _props, _render, _done;
        _done = function (p) {
            _renderable = true;
            _props = Object.freeze(p);
            return _props;
        };
        _render = function (renderer, result) {
            var p = preRender.call(_render, colMap.properties, result, _done);
            var data = onRender(p, result, colMap.properties.rowTemplate);
            renderer(data, colMap.headers);
        };
        Object.defineProperty(_render, "isPrerendered", {
            get: function () { return _renderable; }
        });
        Object.defineProperty(_render, "renderObj", {
            get: function () { return _props; }
        });
        return _render;
    };

    var onRender = function (props, result, rowTemplate) {
        var data = [];
        result.forEach(function (row) {
            data.push(rowRenderer(props, row.Cells.results, rowTemplate));
        });
        return data;
    };

    var preRender = function (mappings, result, done) {
        if (this.isPrerendered) return this.renderObj;
        var props;
        if (result.length > 0) {
            props = result[0].Cells.results.reduce(function (p, c, i) {
                var renderingIndex = mappings.propertiesToRender.indexOf(c.Key);
                if (renderingIndex > -1)
                    p.rendered.push(Object.freeze({ ri: renderingIndex, pi: i }));
                p.all[c.Key] = i;
                return p;
            }, { rendered: [], all: {} });

            props.rendered = sortRenderedProperties(props.rendered);
            Object.freeze(props.all);
            Object.freeze(props.rendered);

        }
        return done(props || {});
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

    var rowRenderer = function (props, data, rowTemplate) {
        var row = props.rendered.map(function (current, index) {
            return rowTemplate[current.ri](data, current, props.all);
        });
        return row;
    };

    var cabal = function (properties, headers) {
        return Cabal({ properties: propertyTransformer(properties),
                       headers: headerTransformer(headers) });
    };

    cabal.VERSION = "0.4.0";

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

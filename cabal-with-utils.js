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
        var _renderable = false, _props, _render, _preR, _last, _onR;
        _preR = function (p) {
            _renderable = true;
            _props = Object.freeze(p);
            return _props;
        };
        _onR = function (d) {
            _last = d;
            return _last;
        };
        _render = function (renderer, result) {
            var p = preRender.call(_render, colMap.properties, result, _preR);
            var data = onRender(p, result, colMap.properties.rowTemplate, _onR);
            renderer(data, colMap.headers);
        };
        Object.defineProperty(_render, "isPrerendered", {
            get: function () { return _renderable; }
        });
        Object.defineProperty(_render, "renderObj", {
            get: function () { return _props; }
        });
        Object.defineProperty(_render, "lastRendered", {
            get: function () { return _last; }
        });
        return _render;
    };

    var onRender = function (props, result, rowTemplate, done) {
        var data = [];
        result.forEach(function (row) {
            data.push(rowRenderer(props, row.Cells.results, rowTemplate));
        });
        return done(data);
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

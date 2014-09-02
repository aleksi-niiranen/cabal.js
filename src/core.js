(function (root) {
    var addMethod = function (object, name, fn) {
        var old = object[name];
        object[name] = function () {
            if (fn.length === arguments.length)
                return fn.apply(this, arguments);
            else if (typeof old === 'function')
                return old.apply(this, arguments);
        };
    };

    var Cabal = function (columnMappings, component) {
        var cm = columnMappings,
            c = component;

        if (c.isContainer === false)
            throw (new Error("Component must be a container."));

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

    var components = {};

    var cabal = function (columnMappings, component) {
        return Cabal(columnMappings, component);
    };

    cabal.VERSION = "0.3.0";

    cabal.Headers = function (titles, type) {
        var headers = titles.map(function (title) {
            return { type: type, inputs: { children: title } };
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

    addMethod(cabal, 'component', function (name) {
        return components[name];
    });

    addMethod(cabal, 'component', function (name, renderFn) {
        cabal.component(name, renderFn, false);
    });

    addMethod(cabal, 'component', function (name, renderFn, isContainer) {
        if (typeof(renderFn) !== 'function')
            throw (new Error("Extensions must be functions."));
        if (components[name] !== undefined)
            throw (new Error("Overriding components is not allowed."));
        components[name] = React.createClass({
            render: renderFn
        });
        components[name].isContainer = isContainer;
    });

    if (typeof(root.cabal) === 'undefined')
        root.cabal = cabal;
})(this);

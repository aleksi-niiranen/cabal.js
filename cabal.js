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

(function (cabal) {
    var components = {},
        utils = {};

    utils.mapToRow = function (rowData) {
        if (!rowData) return [];
        var row = rowData.map(function (current) {
            return (React.DOM.td({}, components[current.type]({element: current.element, inputs: current.inputs})));
        });
        return row;
    };

    utils.mapToRows = function (rowsData) {
        if (!rowsData) return [];
        var rows = rowsData.map(function (current) {
            return components.TableRow({rowData: current});
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
                                  [(labels ? components[labels[index].type]({inputs: labels[index].inputs}) : undefined), 
                                  components[current.type]({element: current.element, inputs: current.inputs}), 
                                  (!isLast ? React.DOM.br({}) : undefined)]);
        });
        return item;
    };

    components.Link = React.createClass({
        render: function () {
            return (React.DOM.a(this.props.inputs));
        }
    });

    components.Image = React.createClass({
        render: function () {
            if (!this.props.inputs.src)
                this.props.inputs.src = this.props.inputs.children;
            delete this.props.inputs.children;
            return (React.DOM.img(this.props.inputs));
        }
    });

    components.HeaderColumn = React.createClass({
        render: function () {
            return (React.DOM.th(this.props.inputs));
        }
    });

    components.ItemLabel = React.createClass({
        render: function () {
            return (React.DOM.b(this.props.inputs));
        }
    });

    components.Text = React.createClass({
        render: function () {
            return (React.DOM.span(this.props.inputs));
        }
    });

    components.DateTime = React.createClass({
        render: function () {
            var dt = new Date(this.props.inputs.children);
            this.props.inputs.children = dt.toLocaleString();
            return (React.DOM.span(this.props.inputs));
        }
    });

    components.react = React.createClass({
        render: function () {
            var fn = this.props.element;
            return (React.DOM[fn](this.props.inputs));
        }
    });

    components.TableRow = React.createClass({
        render: function () {
            return (React.DOM.tr({}, utils.mapToRow(this.props.rowData)));
        }
    });

    components.TableHead = React.createClass({
        render: function () {
            return (React.DOM.thead({
            }, (React.DOM.tr({}, this.props.headers.map(function (current) {
                return components[current.type]({inputs: current.inputs});
            })))));
        }
    });

    components.TableBody = React.createClass({
        render: function () {
            return (React.DOM.tbody({
            }, utils.mapToRows(this.props.data)));
        }
    });

    components.Table = React.createClass({
        render: function () {
            return (React.DOM.table({
                className: 'cabal-table'
            }, 
            [components.TableHead({headers: this.props.headers}),
             components.TableBody({data: this.props.data})]));
        }
    });
    components.Table.isContainer = true;

    components.List = React.createClass({
        render: function () {
            return (React.DOM.ul({
                className: 'cabal-list'
            }, [utils.mapToListItems({headers: this.props.headers, data: this.props.data})]));
        }
    });
    components.List.isContainer = true;

    var component = function (name, renderFn, isContainer) {
        if (typeof(renderFn) !== 'function') {
            throw (new Error("Extensions must be functions."));
        }
        if (components[name] !== undefined) {
            throw (new Error("Overriding components is not allowed."));
        }
        components[name] = React.createClass({
            render: renderFn
        });
        components[name].isContainer = isContainer;
    };

    component.container = function (name) {
        return components[name];
    };

    if (typeof(cabal.component) === 'undefined') {
        cabal.component = component;
    }
})(this.cabal);

(function (cabal) {
    var CabalProperty = function (name) {
        this.name = name;
        this.componentType = 'Text';
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

    CabalProperty.prototype.react = function (tag) {
        this.componentType = 'react';
        this.element = tag;
        return this;
    };

    var mapProperty = function (name) {
        var p = new CabalProperty(name);
        return p;
    };

    mapProperty.extend = function (name, fn) {
        if (typeof(fn) !== 'function')
            throw (new Error("Extensions must be functions."));
        if (CabalProperty.prototype[name] !== undefined)
            throw (new Error("Overriding properties or methods is not allowed."));
        CabalProperty.prototype[name] = fn;
        return fn;
    };

    if (typeof(cabal.mapper) === 'undefined') {
        cabal.mapper = mapProperty;
    }
})(this.cabal);

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
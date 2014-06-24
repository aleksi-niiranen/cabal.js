(function (cabal) {
    var mod = {};

    var utils = {};

    utils.mapToRow = function (rowData) {
        if (!rowData) return [];
        var row = rowData.map(function (current) {
            return (React.DOM.td({}, mod[current.type]({element: current.element, inputs: current.inputs})));
        });
        return row;
    };

    utils.mapToRows = function (rowsData) {
        if (!rowsData) return [];
        var rows = rowsData.map(function (current) {
            return mod.TableRow({rowData: current});
        });
        return rows;
    };

    utils.mapToListItems = function (itemsData) {
        if (!itemsData.data) return [];
        var items = itemsData.data.map(function (current) {
            return (React.DOM.li({}, utils.mapToListItem(current, itemsData.labels)));
        });
        return items;
    };

    utils.mapToListItem = function (itemData, labels) {
        if (!itemData) return [];
        var totalLength = itemData.length - 1;
        var item = itemData.map(function (current, index) {
            var isLast = totalLength === index;
            return React.DOM.span({}, 
                                  [(labels ? mod[labels[index].type]({inputs: labels[index].inputs}) : undefined), 
                                  mod[current.type]({element: current.element, inputs: current.inputs}), 
                                  (!isLast ? React.DOM.br({}) : undefined)]);
        });
        return item;
    };

    mod.Link = React.createClass({
        render: function () {
            return (React.DOM.a(this.props.inputs));
        }
    });

    mod.Image = React.createClass({
        render: function () {
            if (!this.props.inputs.src)
                this.props.inputs.src = this.props.inputs.children;
            delete this.props.inputs.children;
            return (React.DOM.img(this.props.inputs));
        }
    });

    mod.HeaderColumn = React.createClass({
        render: function () {
            return (React.DOM.th(this.props.inputs));
        }
    });

    mod.ItemLabel = React.createClass({
        render: function () {
            return (React.DOM.b(this.props.inputs));
        }
    });

    mod.TextNode = React.createClass({
        render: function () {
            return (React.DOM.span(this.props.inputs));
        }
    });

    mod.DateTime = React.createClass({
        render: function () {
            var dt = new Date(this.props.inputs.children);
            this.props.inputs.children = dt.toLocaleString();
            return (React.DOM.span(this.props.inputs));
        }
    });

    mod.react = React.createClass({
        render: function () {
            var fn = this.props.element;
            return (React.DOM[fn](this.props.inputs));
        }
    });

    mod.TableRow = React.createClass({
        render: function () {
            return (React.DOM.tr({}, utils.mapToRow(this.props.rowData)));
        }
    });

    mod.TableHead = React.createClass({
        render: function () {
            return (React.DOM.thead({
            }, (React.DOM.tr({}, this.props.headers.map(function (current) {
                return mod[current.type]({inputs: current.inputs});
            })))));
        }
    });

    mod.TableBody = React.createClass({
        render: function () {
            return (React.DOM.tbody({
            }, utils.mapToRows(this.props.data)));
        }
    });

    mod.Table = React.createClass({
        render: function () {
            return (React.DOM.table({
                className: 'cabal-table'
            }, 
            [mod.TableHead({headers: this.props.headers}),
             mod.TableBody({data: this.props.data})]));
        }
    });

    mod.List = React.createClass({
        render: function () {
            return (React.DOM.ul({
                className: 'cabal-list'
            }, [utils.mapToListItems({labels: this.props.labels, data: this.props.data})]));
        }
    });

    mod.extend = function (name, renderFn) {
        if (typeof(renderFn) !== 'function')
            throw (new Error("Extensions must be functions."));
        if (mod[name] !== undefined)
            throw (new Error("Overriding components is not allowed."));
        mod[name] = React.createClass({
            render: renderFn
        });
    };

    cabal.components = mod;
})(cabal);

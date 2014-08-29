(function (cabal) {
    var utils = {},
        comp = cabal.component;

    utils.mapToRow = function (rowData) {
        if (!rowData) return [];
        var row = rowData.map(function (current) {
            return (React.DOM.td({}, comp(current.type)({element: current.element, inputs: current.inputs})));
        });
        return row;
    };

    utils.mapToRows = function (rowsData) {
        if (!rowsData) return [];
        var rows = rowsData.map(function (current) {
            return comp('TableRow')({rowData: current});
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
                                  [(labels ? comp(labels[index].type)({inputs: labels[index].inputs}) : undefined),
                                  comp(current.type)({element: current.element, inputs: current.inputs}),
                                  (!isLast ? React.DOM.br({}) : undefined)]);
        });
        return item;
    };

    comp('Link', function () {
            return (React.DOM.a(this.props.inputs));
    });

    comp('Image', function () {
        if (!this.props.inputs.src)
            this.props.inputs.src = this.props.inputs.children;
        delete this.props.inputs.children;
        return (React.DOM.img(this.props.inputs));
    });

    comp('HeaderColumn', function () {
        return (React.DOM.th(this.props.inputs));
    });

    comp('ItemLabel', function () {
        return (React.DOM.b(this.props.inputs));
    });

    comp('Text', function () {
        return (React.DOM.span(this.props.inputs));
    });

    comp('DateTime', function () {
        var dt = new Date(this.props.inputs.children);
        this.props.inputs.children = dt.toLocaleString();
        return (React.DOM.span(this.props.inputs));
    });

    comp('react', function () {
        var fn = this.props.element;
        return (React.DOM[fn](this.props.inputs));
    });

    comp('TableRow', function () {
        return (React.DOM.tr({}, utils.mapToRow(this.props.rowData)));
    });

    comp('TableHead', function () {
        return React.DOM.thead({}, React.DOM.tr({}, this.props.headers.map(function (current) { 
            return comp(current.type)({inputs: current.inputs});
        })));
    });

    comp('TableBody', function () {
        return React.DOM.tbody({}, utils.mapToRows(this.props.data));
    });

    comp('Table', function () {
        return React.DOM.table({
            className: 'cabal-table'
        }, [comp('TableHead')({headers: this.props.headers}),
            comp('TableBody')({data: this.props.data})]);
    }, true);

    comp('List', function () {
        return React.DOM.ul({
            className: 'cabal-list'
        }, utils.mapToListItems({headers: this.props.headers, data: this.props.data}));
    }, true);
})(this.cabal);

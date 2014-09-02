(function (cabal) {
    var utils = cabal.utils,
        comp = cabal.component;

    comp('Image', function () {
        if (!this.props.src)
            this.props.src = this.props.children;
        delete this.props.children;
        return (React.DOM.img(this.props));
    });

    comp('DateTime', function () {
        var dt = new Date(this.props.children);
        this.props.children = dt.toLocaleString();
        return (React.DOM.span(this.props));
    });

    comp('TableRow', function () {
        return (React.DOM.tr({}, utils.mapToRow(this.props.rowData, 'td')));
    });

    comp('TableHead', function () {
        return React.DOM.thead({}, React.DOM.tr({}, this.props.headers.map(function (current) { 
            return utils.getComponent(current.type)(current.inputs);
        })));
    });

    comp('TableBody', function () {
        return React.DOM.tbody({}, utils.mapToRows(this.props.data, 'TableRow'));
    });

    comp('Table', function () {
        return React.DOM.table({
            className: 'cabal-table'
        }, [utils.getComponent('TableHead')({headers: this.props.headers}),
            utils.getComponent('TableBody')({data: this.props.data})]);
    }, true);

    comp('List', function () {
        return React.DOM.ul({
            className: 'cabal-list'
        }, utils.mapToListItems({headers: this.props.headers, data: this.props.data}));
    }, true);
})(this.cabal);

Ext.define('Dashboard.grid.TrendCountPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.trendcountpanel',

    requires: [
        'Dashboard.store.TrendCountTabular'
    ],

    errorRetrievingTrendCountText: 'An error has occurred retrieving trend count data.',

    initComponent: function () {
        var me = this;

        Ext.apply(this, Ext.apply(this.initialConfig, {
            columns: [
                {
                    text: 'Product',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'product'
                }
            ],
            enableColumnHide: false,
            viewConfig: {
                stripeRows: true
            }
        }));

        this.store = Ext.create('Dashboard.store.TrendCountTabular', {
            firstFieldConfig: {id: 'product', type: 'auto'},
            listeners: {
                dynamicload: function (records, operation, success) {
                    if (success) {
                        me.reconfigureGrid(me.store);
                    } else {
                        Dashboard.manager.Error.displayError(me.errorRetrievingTrendCountText);
                    }
                }
            }
        });

        this.callParent();
    },

    reconfigureGrid: function (store) {
        var columns = [],
            columnBase = {
                flex: 1,
                sortable: true
            };

        Ext.each(Ext.Object.getKeys(store.data.items[0].data), function (item, index, allItems) {
            columns.push(Ext.apply(Ext.apply({}, columnBase), {
                text: item === 'product' ? 'Product' : Ext.Date.format(new Date(item.replace(/-/gi, '/')), 'm/d/Y'),
                dataIndex: item
            }));
        });

        // product must be first column
        Ext.Array.insert(columns, 0, [columns[14]]).splice(columns.length - 1);

        this.reconfigure(store, columns);
    }
});
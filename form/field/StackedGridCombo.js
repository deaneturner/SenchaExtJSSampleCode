Ext.define('Dashboard.form.field.StackedGridCombo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.stackedgridcombo',

    layout: 'vbox',

    defaults: {
        width: '100%',
        flex: 1,
        frame: false,
        header: false,
        columnLines: false,
        sortableColumns: false,
        enableColumnHide: false,
        iconCls: 'icon-grid'
    },
    initComponent: function () {
        var me = this;

        this.items = [
            {
                xtype: 'gridpanel',
                itemId: 'inclusiongrid',
                store: this.store,
//                viewConfig: {
//                    selectedItemCls: ''
//                },
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    checkOnly: true,
                    listeners: {
                        deselect: function (selModel, record, index, eOpts) {
                            var omissionGrid = me.query('#omissiongrid')[0];

                            selModel.store.removeAt(index);
                            omissionGrid.store.add(record.data);

                        },
                        selectionchange: function (selModel, selected, eOpts) {
                            me.fireEvent('selectionchange', selModel, selected, eOpts);
                        }
                    }
                }),
                columns: this.columns || [],
                hideHeaders: true,
                resizable: {
                    handles: 's',
                    pinned: true
                }
            },
            {
                xtype: 'gridpanel',
                itemId: 'omissiongrid',
                store: (this.omissionStore = Ext.create('Ext.data.Store', {
                    model: this.store.model.displayName,
                    sorters: this.store.sorters.items,
                    sortOnLoad: true,
                    remoteSort: false
                })),
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    checkOnly: true,
                    listeners: {
                        select: function (selModel, record, index, eOpts) {
                            var inclusionGrid = me.query('#inclusiongrid')[0];

                            selModel.store.removeAt(index);
                            inclusionGrid.store.add(record.data);
                            inclusionGrid.getSelectionModel().select(Ext.create(this.store.model.displayName, record.data), true, true);
                            me.fireEvent('selectionchange', selModel, inclusionGrid.getSelectionModel().getSelection(), eOpts);
                        }
                    }
                }),
                columns: this.columns || [],
                hideHeaders: true
            }
        ];

        this.callParent();

        this.addEvents('selectionchange');
    }
});
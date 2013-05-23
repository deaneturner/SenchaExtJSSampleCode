/**
 * @class Dashboard.view.Transaction
 *
 * The transaction view.
 *
 * @extends Ext.container.Container
 */
Ext.define('Dashboard.view.Transaction', {
    extend: 'Ext.container.Container',
    alias: 'widget.transaction',
    requires: ['Dashboard.container.PageHeader',
        'Dashboard.grid.TransactionPanel',
        'Dashboard.toolbar.GlobalFilter',
        'Dashboard.toolbar.Dashboard',
        'Dashboard.toolbar.GridToolbar',
        'Dashboard.toolbar.StatusToolbar'],

    pageHeaderText: 'CLM Transaction View',

    initComponent: function () {

        Ext.apply(this, Ext.applyIf(this.initialConfig, {
            hideMode: 'offsets',
            layout: 'vbox'
        }));

        this.callParent();

        this.add([
            {
                xtype: 'pageheader',
                text: this.pageHeaderText
            },
            {
                xtype: 'container',
                layout: 'hbox',
                flex: 1,
                width: '100%',
                items: [
                    {
                        xtype: 'globalfilter',
                        manageOverflow: 1,
                        height: '100%',
                        resizable: {
                            handles: 'e',
                            pinned: true
                        }
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 1,
                        height: '100%',
                        manageOverflow: 1,
                        defaults: {
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'statustoolbar'
                            },
                            {
                                xtype: 'dashboardtoolbar',
                                items: [
                                    {
                                        xtype: 'gridtoolbar'
                                    }
                                ]
                            },
                            {
                                xtype: 'transactionpanel',
                                flex: 1,
                                stateId: 'transactiongrid',
                                stateful: false,
                                autoScroll: true,
                                viewConfig: {
                                    loadMask: false
                                },
                                store: 'Dashboard.store.Transaction',
                                exportCsvForm: {
                                    xtype: 'form',
                                    standardSubmit: true,
                                    method: 'POST',
                                    url: '../transaction/exportcsv',
                                    height: 0,
                                    width: 0,
                                    hidden: true,
                                    defaults: {
                                        xtype: 'combobox',
                                        multiSelect: true
                                    },
                                    items: [
                                        {
                                            name: 'productTypes'
                                        },
                                        {
                                            name: 'fileTypes'
                                        },
                                        {
                                            name: 'transportTypes'
                                        },
                                        {
                                            name: 'partnerTypes'
                                        }
                                    ]

                                }
                            }
                        ]
                    }
                ]
            }
        ]);

        // logging
        this.addListener('render', function (panel, eOpts) {
            Dashboard.log('Event: Render, ' + panel.xtype + ', OwnerCt: ' + panel.ownerCt.xtype);
        });

    }
});
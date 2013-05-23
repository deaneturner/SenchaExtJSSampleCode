/**
 * @class Dashboard.panel.Tabular
 *
 * @extends Ext.panel.Panel
 */
Ext.define('Dashboard.panel.Tabular', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tabularpanel',

    requires: [
        'Dashboard.grid.CountPanel',
        'Dashboard.grid.TrendCountPanel',
        'Dashboard.grid.FileDispositionPanel',
        'Dashboard.grid.SrQueuePanel',
        'Dashboard.grid.InstallBasePanel',
        'Dashboard.grid.SrEligibleFilePanel'
    ],

    layout: 'vbox',
    border: 0,

    defaults: {
        xtype: 'container',
        flex: 1,
        width: '100%',
        margin: '15 15 15 15'
    },

    initComponent: function () {
        this.items = [
            // trend count
            {
                xtype: 'trendcountpanel',
                itemId: 'trendcount' + this.viewTypeName + 'grid'
            },
            // product, fite, transport, parter type
            {
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    flex: 1,
                    height: '100%',
                    margins: '0 0 0 30'
                },
                items: Ext.clean([
                    {
                        xtype: 'countpanel',
                        itemId: 'productCount' + this.viewTypeName + 'grid',
                        store: Ext.create('Ext.data.Store', {
                            model: 'Dashboard.model.Count'
                        }),
                        storeName: 'productCountStore',
                        column1Heading: 'Product',
                        margins: '0 0 0 0',
                        listeners: {
                            cellclick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                                Dashboard.app.getController('Toolbar').setAdditionalCriteriaModel('file', {
                                    "component": 'productCount',
                                    "item": record.data.item,
                                    "value": record.data.count
                                });

                                Dashboard.app.getController('Toolbar').fireEvent(Dashboard.controller.Toolbar.applyFilters, {
                                    viewTypeName: 'file'
                                });
                            }
                        }
                    },
                    {
                        xtype: 'container',
                        layout: 'vbox',

                        defaults: {
                            flex: 1,
                            width: '100%',
                            margins: '0 0 10 0'
                        },
                        items: [
                            // file
                            {
                                xtype: 'countpanel',
                                itemId: 'fileTypeCount' + this.viewTypeName + 'grid',
                                store: Ext.create('Ext.data.Store', {
                                    model: 'Dashboard.model.Count'
                                }),
                                storeName: 'fileTypeCountStore',
                                column1Heading: 'File Type'
                            },
                            // transport
                            {
                                xtype: 'countpanel',
                                itemId: 'transportTypeCount' + this.viewTypeName + 'grid',
                                store: Ext.create('Ext.data.Store', {
                                    model: 'Dashboard.model.Count'
                                }),
                                storeName: 'transportTypeCountStore',
                                column1Heading: 'Transport Type'
                            },
                            // partner
                            {
                                xtype: 'countpanel',
                                itemId: 'emcPartnerCount' + this.viewTypeName + 'grid',
                                store: Ext.create('Ext.data.Store', {
                                    model: 'Dashboard.model.Count'
                                }),
                                storeName: 'emcPartnerCountStore',
                                column1Heading: 'EMC/Partner',
                                margins: '0 0 0 0'
                            }

                        ]

                    },
                    this.viewTypeName === 'file' ? {
                        xtype: 'filedispositionpanel',
                        itemId: 'fileDisposition' + this.viewTypeName + 'grid',
                        store: Ext.create('Ext.data.Store', {
                            model: 'Dashboard.model.Count'
                        }),
                        storeName: 'fileDispositionStore'
                    } : '',
                    this.viewTypeName === 'sr' ? {
                        xtype: 'sreligiblefilepanel',
                        itemId: 'srEligibleFile' + this.viewTypeName + 'grid',
                        store: Ext.create('Ext.data.Store', {
                            model: 'Dashboard.model.Count'
                        }),
                        storeName: 'srEligibleFileStore'
                    } : ''
                ])
            },
            // sr queues (sr tabular only)
            (this.viewTypeName === 'file' ? {
                xtype: 'container',
                hidden: true
            } : {
                xtype: 'srqueuepanel',
                itemId: 'srQueue' + this.viewTypeName + 'grid',
                store: Ext.create('Ext.data.Store', {
                    model: 'Dashboard.model.SrQueue',
                    sorters: [
                        {
                            property: 'queuedCounts',
                            direction: 'DESC'
                        }
                    ],
                    sortOnLoad: true,
                    remoteSort: false
                }),
                stackedGridComboStore: Ext.create('Ext.data.Store', {
                    model: 'Dashboard.model.SrQueue',
                    sorters: [
                        {
                            property: 'queueFilter',
                            direction: 'ASC'
                        }
                    ],
                    sortOnLoad: true,
                    remoteSort: false
                })
            }),
            // install base
            {
                xtype: 'installbasepanel',
                itemId: 'installBase' + this.viewTypeName + 'grid',
                store: Ext.create('Ext.data.Store', {
                    model: 'Dashboard.model.InstallBase',
                    sorters: [
                        {
                            property: 'installed',
                            direction: 'DESC'
                        }
                    ],
                    sortOnLoad: true,
                    remoteSort: false
                }),
                stackedGridComboStore: Ext.create('Ext.data.Store', {
                    model: 'Dashboard.model.InstallBase',
                    sorters: [
                        {
                            property: 'product',
                            direction: 'ASC'
                        }
                    ],
                    sortOnLoad: true,
                    remoteSort: false
                })
            }
        ];

        this.callParent();

        // logging
        this.addListener('render', function (panel, eOpts) {
            Dashboard.log('Event: Render, ' + panel.xtype + ', OwnerCt: ' + panel.ownerCt.xtype);
        });
    }
});
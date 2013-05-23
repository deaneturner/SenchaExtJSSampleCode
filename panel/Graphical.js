/**
 * @class Dashboard.panel.Graphical
 *
 * @extends Ext.panel.Panel
 */
Ext.define('Dashboard.panel.Graphical', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.graphicalpanel',

    requires: [
        'Dashboard.chart.series.CountPie',
        'Dashboard.chart.series.TrendCountLine',
        'Dashboard.chart.series.InstallBaseColumn',
        'Dashboard.chart.series.SrQueueColumn',
        'Dashboard.chart.series.AdditionalSrInfoColumn'
    ],

    layout: 'vbox',
    border: 0,

    defaults: {
        xtype: 'container',
        //flex: 1,
        resizable: {
            handles: 's',
            pinned: true
        },
        width: '100%'
    },

    initComponent: function () {
        this.items = [
            {
                //flex: .5,
                height: 700,
                layout: 'fit',
                items: [
                    {
                        xtype: 'trendcountline',
                        itemId: 'trendcountchart' + this.viewTypeName,
                        margins: '40 40 40 40'
                    }
                ]
            },
            {
                xtype: 'panel',
                itemId: 'filteredcount' + this.viewTypeName,
                flex: 1,
                layout: 'vbox',
                border: 0,
                defaults: {
                    flex: 1
                },
                dockedItems: [
                    {
                        xtype: 'statustoolbar',
                        height: 20,
                        dock: 'top',
                        margin: '0 0 0 20',
                        hidden: true
                    }
                ],
                items: Ext.clean([
                    // top
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: '100%',
                        defaults: {
                            height: '100%'
                        },
                        items: [
                            // product types
                            {
                                xtype: 'countpie',
                                itemId: 'productCount' + this.viewTypeName,
                                flex: 1,
                                store: Ext.create('Ext.data.Store', {
                                    model: 'Dashboard.model.Count'
                                }),
                                storeName: 'productCountStore',
                                title: (this.viewTypeName === 'file' ? 'File' : 'SR') + ' Breakdown by Product Type'
                            },
                            {
                                xtype: 'container',
                                flex: 3,
                                layout: 'vbox',
                                defaults: {
                                    flex: 1,
                                    width: '100%'
                                },
                                items: [
                                    // sub top
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        defaults: {
                                            height: '100%'
                                        },
                                        items: [
                                            // file type
                                            {
                                                xtype: 'countpie',
                                                itemId: 'fileTypeCount' + this.viewTypeName,
                                                flex: 1,
                                                store: Ext.create('Ext.data.Store', {
                                                    model: 'Dashboard.model.Count'
                                                }),
                                                storeName: 'fileTypeCountStore',
                                                title: (this.viewTypeName === 'file' ? 'File' : 'SR') + ' Breakdown by File Type'
                                            },
                                            // transport type
                                            {
                                                xtype: 'countpie',
                                                itemId: 'transportTypeCount' + this.viewTypeName,
                                                flex: 1,
                                                store: Ext.create('Ext.data.Store', {
                                                    model: 'Dashboard.model.Count'
                                                }),
                                                storeName: 'transportTypeCountStore',
                                                title: (this.viewTypeName === 'file' ? 'File' : 'SR') + ' Breakdown by Transport Type'
                                            },
                                            // partner type
                                            {
                                                xtype: 'countpie',
                                                itemId: 'emcPartnerCount' + this.viewTypeName,
                                                flex: 1,
                                                store: Ext.create('Ext.data.Store', {
                                                    model: 'Dashboard.model.Count'
                                                }),
                                                storeName: 'emcPartnerCountStore',
                                                title: (this.viewTypeName === 'file' ? 'File' : 'SR') + ' Breakdown by EMC/Partner'
                                            }
                                        ]
                                    },
                                    // sub bottom
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        defaults: {
                                            height: '100%',
                                            flex: 1
                                        },
                                        items: Ext.clean([
                                            // sr breakdown (sr graphical only)
                                            this.viewTypeName === 'sr' ? {
                                                xtype: 'countpie',
                                                itemId: 'srBreakdown' + this.viewTypeName,
                                                store: Ext.create('Ext.data.Store', {
                                                    model: 'Dashboard.model.Count'
                                                }),
                                                storeName: 'srBreakdownStore',
                                                title: 'SR Breakdown'
                                            } : '',
                                            // additional sr info (sr graphical only)
                                            this.viewTypeName === 'sr' ? {
                                                xtype: 'additionalsrinfocolumn',
                                                itemId: 'additionalSrInfo' + this.viewTypeName,
                                                store: Ext.create('Ext.data.Store', {
                                                    model: 'Dashboard.model.Count'
                                                }),
                                                storeName: 'additionalSrInfoStore',
                                                title: 'Additional SR Create Data'
                                            } : '',
                                            // disposition breakdown (file graphical only)
                                            this.viewTypeName === 'file' ? {
                                                xtype: 'countpie',
                                                itemId: 'fileDisposition' + this.viewTypeName,
                                                store: Ext.create('Ext.data.Store', {
                                                    model: 'Dashboard.model.Count'
                                                }),
                                                storeName: 'fileDispositionStore',
                                                series: [
                                                    {
                                                        type: 'pie',
                                                        label: {
                                                            field: 'item'
                                                        },
                                                        field: 'count',
                                                        showInLegend: true,
                                                        donut: false
                                                    }
                                                ],
                                                title: 'Disposition Breakdown'
                                                /*
                                                 * setting the width to a hard value here will result in a significant
                                                 * rendering time
                                                 */
                                            } : '',
                                            this.viewTypeName === 'file' ? {
                                                xtype: 'container'
                                            } : '',
                                            this.viewTypeName === 'file' ? {
                                                xtype: 'container'
                                            } : ''
                                        ])
                                    }
                                ]
                            }
                        ]
                    },
                    // sr queue count (sr graphical only)
                    (this.viewTypeName === 'sr' ? {
                        xtype: 'container',
                        width: '100%',
                        maxHeight: 300,
                        layout: {
                            type: 'vbox',
                            align: 'center'
                        },
                        items: [
                            {
                                xtype: 'panel',
                                itemId: 'srqueuecount' + this.viewTypeName,
                                layout: 'hbox',
                                border: 0,
                                width: '100%',
                                flex: 1,
                                dockedItems: [
                                    {
                                        xtype: 'statustoolbar',
                                        height: 20,
                                        dock: 'top',
                                        margin: '0 0 0 20',
                                        hidden: false
                                    }
                                ],
                                items: [
                                    {
                                        xtype: 'srqueuecolumn',
                                        itemId: 'srQueue' + this.viewTypeName,
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
                                        storeName: 'srQueueStore',
                                        title: ' SR Queue Count',
                                        flex: 1,
                                        height: '100%'
                                    },
                                    {
                                        xtype: 'stackedgridcombo',
                                        title: 'Select Queues',
                                        store: Ext.create('Ext.data.Store', {
                                            model: 'Dashboard.model.SrQueue',
                                            sorters: [
                                                {
                                                    property: 'queueFilter',
                                                    direction: 'ASC'
                                                }
                                            ],
                                            sortOnLoad: true,
                                            remoteSort: false
                                        }),
                                        columns: [
                                            { flex: 1, dataIndex: 'queueFilter'}
                                        ],
                                        width: 220,
                                        height: 160,
                                        margins: '20 0 20 0'
                                    }
                                ]
                            }
                        ]
                    } : '')
                ])
            },
            {
                // installed base counts
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                //flex: .5,
                height: 300,
                margins: '10 40 40 40',
                defaults: {
                    width: '100%'
                },
                items: [
                    {
                        xtype: 'container',
                        html: 'INSTALLED BASE COUNTS',
                        height: 20,
                        style: {
                            'font-weight': 'bold'
                        },
                        margins: '10 0 10 10'
                    },
                    {
                        xtype: 'installbasecolumn',
                        itemId: 'installBase' + this.viewTypeName,
                        store: Ext.create('Ext.data.Store', {
                            model: 'Dashboard.model.InstallBase'
                        }),
                        storeName: 'installBaseStore',
                        title: {
                            text: 'Note: Only the Product Global Filter applies to the chart.',
                            bold: false
                        },
                        flex: 1
                    }
                ]
            }
        ];

        this.callParent();

        // logging
        this.addListener('render', function (panel, eOpts) {
            Dashboard.log('Event: Render, ' + panel.xtype + ', OwnerCt: ' + panel.ownerCt.xtype);
        });
    }
});
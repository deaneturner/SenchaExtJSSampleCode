/**
 * @class Dashboard.view.Summary
 *
 * The summary view.
 *
 * @extends Ext.container.Container
 */
Ext.define('Dashboard.view.Summary', {
    extend: 'Ext.container.Container',
    alias: 'widget.summary',
    requires: ['Dashboard.container.PageHeader',
        'Dashboard.toolbar.GlobalFilter',
        'Dashboard.toolbar.Dashboard',
        'Dashboard.toolbar.FilterToolbar',
        'Dashboard.store.Summary',
        'Dashboard.view.FileSummary',
        'Dashboard.view.SrSummary',
        'Ext.form.field.Radio'],

    statics: {
        file: 'file',
        sr: 'sr'
    },

    pageHeaderText: 'Service Request Data Summary',

    initComponent: function () {

        Ext.apply(this, Ext.applyIf(this.initialConfig, {
            hideMode: 'offsets',
            reserveScrollbar: true,
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
                        stateId: 'globalfilter',
                        stateful: false,
                        manageOverflow: 1,
                        height: '100%',
                        resizable: {
                            handles: 'e',
                            pinned: true
                        },
                        items: [
                            {
                                xtype: 'fieldcontainer',
                                defaultType: 'radiofield',
                                defaults: {
                                    flex: 1
                                },
                                layout: 'vbox',
                                items: [
                                    {
                                        boxLabel: 'File Counts',
                                        name: 'viewType',
                                        inputValue: Dashboard.view.Summary.file,
                                        id: 'radio1'
                                    },
                                    {
                                        boxLabel: 'SR Counts',
                                        name: 'viewType',
                                        inputValue: Dashboard.view.Summary.sr,
                                        id: 'radio2'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        height: '100%',
                        layout: 'vbox',
                        flex: 1,
                        manageOverflow: 1,
                        defaults: {
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'statustoolbar',
                                hidden: true
                            },
                            {
                                xtype: 'dashboardtoolbar',
                                items: [
                                    {
                                        xtype: 'filtertoolbar'
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        itemId: 'summarycontainer',
                                        layout: {
                                            type: 'card',
                                            deferredRender: true
                                        },
                                        height: 2000,
                                        store: Ext.create('Dashboard.store.Summary'),
                                        activeItem: Ext.state.Manager.getProvider().get('globalfilter').viewTypeName === 'file' ? 0 : 1,
                                        items: [
                                            {
                                                xtype: 'filesummary'

                                            },
                                            {
                                                xtype: 'srsummary'
                                            }
                                        ]
                                    }
                                ],
                                autoScroll: true
                            }
                        ]
                    }
                ]
            }
        ]);
    }
});
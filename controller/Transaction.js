/**
 * @class Dashboard.controller.Transaction
 *
 * @extends Ext.app.Controller
 */
Ext.define('Dashboard.controller.Transaction', {

    extend: 'Ext.app.Controller',

    stores: ['Transaction'],

    views: ['Transaction'],

    refs: [
        {
            ref: 'gridToolbar',
            selector: 'transaction gridtoolbar'
        },
        {
            ref: 'transactionPanel',
            selector: 'transaction transactionpanel'
        },
        {
            ref: 'summaryContainer',
            selector: '#summarycontainer'
        },
        {
            ref: 'transactionGlobalFilter',
            selector: 'transaction globalfilter'
        }
    ],

    errorRetrievingTransactionsText: 'An error has occurred retrieving transactions.',
    errorRetrievingSummaryInfoText: 'An error has occurred retrieving summary information.',

    defaultState: {"columns": [
        {"id": "timeReceived"},
        {"id": "fileId"},
        {"id": "serialNumber"},
        {"id": "productName"},
        {"id": "deviceType"},
        {"id": "siteName"},
        {"id": "initialSiteNumber"},
        {"id": "currentSiteNumber"},
        {"id": "uCodeVersion"},
        {"id": "osVersion"},
        {"id": "triggerSymptom"},
        {"id": "additionalSymptom"},
        {"id": "parsedCDataContent"},
        {"id": "filterOutcome"},
        {"id": "srAction"},
        {"id": "srNumber"},
        {"id": "initialSeverity"},
        {"id": "currentSeverity"},
        {"id": "initialQueue"},
        {"id": "currentQueue"},
        {"id": "initialSrStatus"},
        {"id": "currentSrStatus"},
        {"id": "serviceProvider"},
        {"id": "initialIbStatus"},
        {"id": "currentIbStatus"},
        {"id": "transportTypeName"},
        {"id": "clmProcessingTime"},
        {"id": "model"},
        {"id": "contact"},
        {"id": "fruSerialNumber"},
        {"id": "fileType"},
        {"id": "emcPartner"}
    ], "sort": {"property": "timeReceived", "direction": "ASC", "root": "data"}, "pageSize": 25},

    init: function (application) {
        var me = this,
            toolbarController = Dashboard.app.getController('Toolbar');

        this.control({
            'transaction transactionpanel': {
                render: function (panel, eOpts) {
                    var state;

                    // apply state
                    state = Ext.state.Manager.getProvider().get('transactiongrid', this.defaultState);
                    panel.applyState(state);
                    if (state.timestamp) {
                        this.getGridToolbar().query('#lastsaved')[0].setValue(state.timestamp);
                    }

                    // load transaction store
                    this.loadTransactionStore(panel.store);
                },

                beforerender: function (panel, eOpts) {
                    toolbarController.viewTypeName = Dashboard.controller.Toolbar.transaction;
                }
            },

            'gridtoolbar #savetablesettings': {
                click: function (btn, e, eOpts) {
                    Ext.state.Manager.getProvider().set('transactiongrid', this.getTransactionPanel().getState());
                }
            },
            'gridtoolbar #restoretablesettings': {
                click: function (btn, e, eOpts) {
                    var panel = this.getTransactionPanel();

                    // apply state
                    panel.applyState(Ext.state.Manager.getProvider().get('transactiongrid'));

                    // load transaction store
                    this.loadTransactionStore(panel.store);
                }
            },

            'gridtoolbar #resettablesettings': {
                click: function (btn, e, eOpts) {
                    var panel = this.getTransactionPanel();

                    // apply state
                    panel.applyState(this.defaultState);

                    // load transaction store
                    this.loadTransactionStore(panel.store);
                }
            },

            'transaction #exportcsv': {
                click: function (btn, e, eOpts) {
                    var form = this.getTransactionPanel().query('form')[0].getForm(),
                        numCsvRecs = this.getTransactionPanel().store.getTotalCount();

                    // set form values using toolbar criteria
                    form.setValues(Dashboard.app.getController('Query').getCriteria());

                    if (numCsvRecs > 2000) {
                        Dashboard.MessageBox.show({
                            title: 'CSV Export',
                            msg: 'Exporting ' + numCsvRecs + ' records will take some time to process. <br><br> Would you like to wait while the process continues to work in the background.',
                            width: 300,
                            height: 200,
                            buttons: Ext.Msg.OKCANCEL,
                            icon: Ext.Msg.QUESTION,
                            fn: function (btn) {
                                if (btn === 'ok') {
                                    form.submit();
                                }
                            }
                        });
                    } else {
                        form.submit();
                    }
                }
            }
        });

        // set the - as of: timestamp
        Ext.state.Manager.getProvider().on('statechange', function (provider, stateId, state) {
            if (stateId === 'transactiongrid') {
                me.getGridToolbar().query('#lastsaved')[0].setValue(state.timestamp);
            }
        });

        /*
         * Apply Filters
         */
        application.getController('Toolbar').on('applyfilters', function (opts) {
            if (opts.viewTypeName === 'transaction') {
                Dashboard.loadMask.show();
                /*
                 * Transaction
                 */
                me.getTransactionPanel().store.load({
                    callback: function (records, operation, success) {
                        if (!success) {
                            Dashboard.manager.Error.displayError(me.errorRetrievingTransactionsText);
                        }
                        Dashboard.loadMask.hide();
                    }
                });
            }
        });
    },

    loadTransactionStore: function (store) {
        var me = this,
            toolbarController = Dashboard.app.getController('Toolbar');

        // load transaction store
        store.load({
            callback: function (records, operation, success) {
                if (success) {
                    // set status display
                    Dashboard.app.getController('Main').displayStatus(Dashboard.util.Date.parseTimestamp(store.proxy.reader.metaData));

                    // set the global filter state from the summary page
                    toolbarController.syncGlobalFilterControls(Dashboard.controller.Toolbar.transaction, toolbarController.getOppositeGlobalFilterPanelType(Dashboard.controller.Toolbar.transaction));
                } else {
                    Dashboard.manager.Error.displayError(me.errorRetrievingTransactionsText);
                }
            }
        });
    }
});
/**
 * @class Dashboard.grid.TransactionPanel
 *
 * A grid panel that lists {@link Dashboard.model.Transaction transaction} records.
 * @extends Ext.grid.Panel
 */
Ext.define('Dashboard.grid.TransactionPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.transactionpanel',
    requires: [
        'Dashboard.store.Transaction',
        'Dashboard.toolbar.Paging',
        'Dashboard.ux.grid.PageSize',
        'Ext.form.action.StandardSubmit'
    ],

    // Text values
    exportText: 'Export to CSV File',
    displayingTransactionsText: 'Displaying transactions {0} - {1} of {2}',
    emptyTransactionsText: 'No transactions found to display.',
    refreshText: 'Refresh',

    dateFormat: 'm/d/Y g:i a',

    initComponent: function () {
        var me = this;

        Ext.apply(this, Ext.applyIf(this.initialConfig, {
            loadMask: true,
            emptyText: this.emptyTransactionsText,
            columns: [
                {
                    id: 'timeReceived',
                    text: 'Time Received',
                    dataIndex: 'timeReceived',
                    width: 120,
                    renderer: Ext.util.Format.dateRenderer(this.dateFormat)
                },
                { text: 'File Id', dataIndex: 'fileId', id: 'fileId' },
                { text: 'Serial Number', dataIndex: 'serialNumber', id: 'serialNumber' },
                { text: 'Product', dataIndex: 'productName', id: 'productName' },
                { text: 'Device Type', dataIndex: 'deviceType', id: 'deviceType' },
                { text: 'Site Name', dataIndex: 'siteName', id: 'siteName' },
                { text: 'Initial Site Number', dataIndex: 'initialSiteNumber', id: 'initialSiteNumber' },
                { text: 'Current Site Number', dataIndex: 'currentSiteNumber', id: 'currentSiteNumber' },
                { text: 'UCode Version', dataIndex: 'uCodeVersion', id: 'uCodeVersion' },
                { text: 'OS Version', dataIndex: 'osVersion', id: 'osVersion' },
                { text: 'Trigger Symptom Code', dataIndex: 'triggerSymptom', id: 'triggerSymptom' },
                { text: 'Additional Symptom Code', dataIndex: 'additionalSymptom', id: 'additionalSymptom' },
                { text: 'CDATA', dataIndex: 'parsedCDataContent', id: 'parsedCDataContent' },
                { text: 'Filter Outcome', dataIndex: 'filterOutcome', id: 'filterOutcome' },
                { text: 'SR Action', dataIndex: 'srAction', id: 'srAction' },
                { text: 'SR Number', dataIndex: 'srNumber', id: 'srNumber' },
                { text: 'Initial Severity', dataIndex: 'initialSeverity', id: 'initialSeverity' },
                { text: 'Current Severity', dataIndex: 'currentSeverity', id: 'currentSeverity' },
                { text: 'Initial Queue', dataIndex: 'initialQueue', id: 'initialQueue' },
                { text: 'Current Queue', dataIndex: 'currentQueue', id: 'currentQueue' },
                { text: 'Initial SR Status', dataIndex: 'initialSrStatus', id: 'initialSrStatus' },
                { text: 'Current SR Status', dataIndex: 'currentSrStatus', id: 'currentSrStatus' },
                { text: 'Service Provider', dataIndex: 'serviceProvider', id: 'serviceProvider' },
                { text: 'Initial IB Status', dataIndex: 'initialIbStatus', id: 'initialIbStatus' },
                { text: 'Current IB Status', dataIndex: 'currentIbStatus', id: 'currentIbStatus' },
                { text: 'Transport Type', dataIndex: 'transportTypeName', id: 'transportTypeName' },
                { text: 'CLM Processing Time', dataIndex: 'clmProcessingTime', id: 'clmProcessingTime', renderer: Ext.util.Format.dateRenderer(this.dateFormat) },
                { text: 'Model', dataIndex: 'model', id: 'model' },
                { text: 'Contact', dataIndex: 'contact', id: 'contact' },
                { text: 'FRU Serial Number', dataIndex: 'fruSerialNumber', id: 'fruSerialNumber' },
                { text: 'File Type', dataIndex: 'fileType', id: 'fileType' },
                { text: 'EMC Or Partner Type', dataIndex: 'emcPartner', id: 'emcPartner' }
            ]
        }));

        this.store = Ext.create(this.store, {
            sorters: [
                {
                    property: 'timeReceived',
                    direction: 'DESC'
                }
            ]
        });

        this.pagingToolbarConfig = {
            store: this.store,
            displayInfo: true,
            displayMsg: this.displayingTransactionsText,
            emptyMsg: this.emptyTransactionsText,
            plugins: ['pagesize']
        };

        this.tbar = this.buildToolbar(this.pagingToolbarConfig);
        this.bbar = this.buildToolbar(this.pagingToolbarConfig);

        this.callParent();

        this.add(this.exportCsvForm);

        this.store.on({
            beforeload: function () {
                // disable CSV buttons
                Ext.each(me.query('#exportcsv'), function (item, index, allItems) {
                    item.disable();
                });
            },

            load: function () {
                // enable CSV buttons
                Ext.each(me.query('#exportcsv'), function (item, index, allItems) {
                    item.enable();
                });
            }
        });

    },

    /**
     * Builds a transaction grid toolbar
     *
     * @param config {Object} The configuration object for the toolbar
     * @return {'Dashboard.toolbar.Paging'} A toolbar instance
     */
    buildToolbar: function (config) {
        var me = this,
            toolbar = Ext.create('Dashboard.toolbar.Paging', config);

        spacerWidth = 50;

        // border - csv file button spacer
        toolbar.insert(0, Ext.create('Ext.toolbar.Spacer', {
            width: 25
        }));

        // export csv
        toolbar.insert(1, Ext.create('Ext.button.Button', {
            text: this.exportText,
            itemId: 'exportcsv',
            pressed: false,
            enableToggle: false,
            disabled: true
        }));

        // csv file button - pager spacer
        toolbar.insert(2, Ext.create('Ext.toolbar.Spacer', {
            width: spacerWidth
        }));

        // pager - refresh spacer
        toolbar.insert(12, Ext.create('Ext.toolbar.Spacer', {
            width: spacerWidth
        }));

        // refresh text
        toolbar.insert(13, Ext.create('Ext.toolbar.TextItem', {
            text: this.refreshText
        }));

        // refresh - page size spacer
        toolbar.insert(16, Ext.create('Ext.toolbar.Spacer', {
            width: spacerWidth
        }));

        return toolbar;
    },

    getState: function () {
        var state = this.callParent();

        // page size
        state = this.addPropertyToState(state, 'pageSize', this.store.pageSize);

        // timestamp
        this.addPropertyToState(state, 'timestamp', Dashboard.util.Date.toTimestampString(new Date()));

        return state;
    },

    applyState: function (state) {

        if (state) {
            // paging toolbar - page size
            Ext.each(this.getDockedItems(), function (item, index, allItems) {
                if (item.xtype === 'dashboardpagingtoolbar') {
                    item.plugins[0].setValue(state.pageSize);
                }
            });

            // store page size
            this.store.pageSize = state.pageSize;
        }

        this.callParent(arguments);
    }
});
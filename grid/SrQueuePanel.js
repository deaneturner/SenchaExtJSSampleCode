Ext.define('Dashboard.grid.SrQueuePanel', {
    extend: 'Ext.container.Container',
    alias: 'widget.srqueuepanel',

    requires: [
        'Dashboard.form.field.StackedGridCombo'
    ],

    srQueueAsOfText: 'Current Count as of',

    layout: 'hbox',
    defaults: {
        height: '100%'
    },
    initComponent: function () {
        this.items = [
            {
                xtype: 'stackedgridcombo',
                title: 'Select Queues',
                store: this.stackedGridComboStore,
                columns: [
                    { flex: 1, dataIndex: 'queueFilter'}
                ],
                flex: 1,
                margins: '0 30 0 0'
            },
            {
                xtype: 'grid',
                flex: 5,
                store: this.store,

                columns: [
                    {
                        text: 'Queue Filter',
                        flex: 1,
                        sortable: false,
                        dataIndex: 'queueFilter'
                    },
                    {
                        text: 'Queued Counts',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'queuedCounts'
                    },
                    {
                        text: 'Current Count',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'currentCount'
                    }
                ],

                viewConfig: {
                    stripeRows: true
                },

                dockedItems: [
                    {
                        xtype: 'displayfield',
                        dock: 'top',
                        labelWidth: 120,
                        fieldLabel: this.srQueueAsOfText,
                        value: new Date()
                    }
                ]
            }
        ];

        this.callParent();
    }
});
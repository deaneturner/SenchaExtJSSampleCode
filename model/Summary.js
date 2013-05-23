Ext.define('Dashboard.model.Summary', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.association.HasMany',
        'Dashboard.model.SrQueue',
        'Dashboard.model.FileDisposition',
        'Dashboard.model.InstallBase',
        'Dashboard.model.Count'],

    proxy: {
        type: 'ajax',
        url: '../summary/summarydata',
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        reader: {
            type: 'json',
            root: 'data'
        },
        successProperty: 'success'
    },

    fields: [
        {name: 'totalSummaryCount', type: 'int'},
        {name: 'totalFilterCount', type: 'int'},
        { name: 'asOfSrQueueCount',
            type: 'auto',
            convert: function (v, record) {
                return Dashboard.util.Date.parseTimestamp(v);
            }
            }
    ],

    hasMany: [
        {model: 'Dashboard.model.SrQueue', name: 'srQueue'},
        {model: 'Dashboard.model.FileDisposition', name: 'fileDisposition'},
        {model: 'Dashboard.model.InstallBase', name: 'installBase'},
        {model: 'Dashboard.model.Count', name: 'srBreakdown'},
        {model: 'Dashboard.model.Count', name: 'additionalSrInfo'},
        {model: 'Dashboard.model.Count', name: 'srEligibleFile'},
        {model: 'Dashboard.model.Count', name: 'productCount'},
        {model: 'Dashboard.model.Count', name: 'fileTypeCount'},
        {model: 'Dashboard.model.Count', name: 'transportTypeCount'},
        {model: 'Dashboard.model.Count', name: 'emcPartnerCount'}
    ]
});

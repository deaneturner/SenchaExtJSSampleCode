Ext.define('Dashboard.view.FileSummary', {
    extend: 'Ext.container.Container',
    alias: 'widget.filesummary',

    requires: [
        'Dashboard.panel.Tabular',
        'Dashboard.panel.Graphical'
    ],

    layout: {
        type: 'card',
        deferredRender: true
    },

    items: [
        {
            xtype: 'graphicalpanel',
            viewTypeName: 'file',
            hideMode: 'offsets'
        },
        {
            xtype: 'tabularpanel',
            viewTypeName: 'file',
            hideMode: 'offsets'
        }
    ],

    listeners: {
        // logging
        render: function (panel, eOpts) {
            Dashboard.log('Event: Render, ' + panel.xtype + ', OwnerCt: ' + panel.ownerCt.xtype);
        }
    }
});
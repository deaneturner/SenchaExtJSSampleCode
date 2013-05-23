Ext.define('Dashboard.chart.series.InstallBaseColumn', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.installbasecolumn',

    mixins: {
        chartTitle: "Dashboard.mixin.ChartTitle"
    },

    requires: [
        'Ext.chart.*'
    ],

    animate: true,
    shadow: true,

    legend: {
        position: 'right'
    },
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: ['installed', 'installedTm', 'shipped', 'awaitingCustInstall', 'resellersMaintained'],
            title: false,
            grid: true
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['product'],
            title: false,
            label: {
                rotate: {
                    degrees: 270
                }
            }
        }
    ],
    series: [
        {
            type: 'column',
            axis: 'left',
            gutter: 80,
            xField: 'product',
            yField: ['installed', 'installedTm', 'shipped', 'awaitingCustInstall', 'resellersMaintained'],
            title: ['Installed', 'Installed T & M', 'Shipped', 'Awaiting Customer Install', 'Resellers Maintained'],
            stacked: true
        }
    ],

    initComponent: function () {
        this.mixins.chartTitle.initComponent.call(this);
        this.callParent(arguments);
    },

    setCustomWidth: function (numBars) {
        this.setWidth((numBars * 30) + 300);
    }
});
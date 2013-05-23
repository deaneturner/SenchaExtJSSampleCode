Ext.define('Dashboard.chart.series.AdditionalSrInfoColumn', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.additionalsrinfocolumn',

    mixins: {
        chartTitle: "Dashboard.mixin.ChartTitle"
    },

    requires: [
        'Ext.chart.*'
    ],

    animate: true,
    shadow: true,

    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: ['count'],
            title: false,
            grid: true
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['item'],
            title: false
        }
    ],
    series: [
        {
            type: 'column',
            axis: 'left',
            gutter: 80,
            xField: 'item',
            yField: ['count'],
            stacked: true
        }
    ],

    initComponent: function () {
        this.mixins.chartTitle.initComponent.call(this);
        this.callParent(arguments);
    }
});
Ext.define('Dashboard.chart.series.SrQueueColumn', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.srqueuecolumn',

    mixins: {
        chartTitle: "Dashboard.mixin.ChartTitle"
    },

    requires: [
        'Ext.chart.*'
    ],

    width: '100%',

    animate: true,
    shadow: true,
    legend: {
        position: 'right'
    },
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: ['queuedCounts', 'currentCount'],
            title: false,
            grid: true
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['queueFilter'],
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
            xField: 'queueFilter',
            yField: ['queuedCounts', 'currentCount'],
            title: ['CLM Queued Count', 'Current Count'],
            stacked: false
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
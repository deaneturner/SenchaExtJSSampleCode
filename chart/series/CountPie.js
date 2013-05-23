Ext.define('Dashboard.chart.series.CountPie', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.countpie',

    mixins: {
        chartTitle: "Dashboard.mixin.ChartTitle"
    },

    requires: [
        'Ext.chart.*'
    ],

    animate: true,
    shadow: true,
    legend: {
        position: 'right',
        update: true
    },
    insetPadding: 20,
    //theme: 'Base:gradients',
    series: [
        {
            type: 'pie',
            label: {
                field: 'itemCount'
            },
            field: 'count',
            showInLegend: true,
            donut: false
        }
    ],

    initComponent: function () {
        this.mixins.chartTitle.initComponent.call(this);
        this.callParent(arguments);
    }


});
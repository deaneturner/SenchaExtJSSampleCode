Ext.define('Dashboard.chart.series.TrendCountLine', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.trendcountline',

    requires: [
        'Dashboard.store.TrendCountGraphical',
        'Ext.chart.*'
    ],

    errorRetrievingTrendCountText: 'An error has occurred retrieving trend count data.',

    initComponent: function () {
        var me = this;

        this.lineColors = [
            '#5cb8ff',
            '#1eb486',
            '#404679',
            '#981b1e',
            '#93c572',
            '#fe6f5e',
            '#fbff00',
            '#78724d',
            '#794044',
            '#8256a4',
            '#a69d86',
            '#20391e',
            '#d6b6e6',
            '#53868b',
            '#790ead',
            '#440700',
            '#b8ff5c',
            '#3ca9d0',
            '#025076',
            '#3333ff',
            '#990066',
            '#99cc99',
            '#cc9900',
            '#ff6600',
            '#669900'
        ];

        Ext.apply(this, Ext.applyIf(this.initialConfig, {
            animate: false,
            insetPadding: 30,
            axes: [],
            series: [],
            legend: {
                position: 'right',
                update: true
            }
        }));

        this.store = Ext.create('Dashboard.store.TrendCountGraphical', {
            firstFieldConfig: {id: 'date', type: 'date', convert: function (value) {
                return new Date(value.replace(/-/gi, '/'));
            }},
            listeners: {
                dynamicload: function (records, operation, success) {
                    me.generateChart(records, operation, success);
                },
                beforeload: function (records, operation, success) {
                    me.series.clear();
                }
            }
        });

        this.callParent();
    },

    generateChart: function (records, operation, success) {
        var me = this,
            seriesNames = (function () {
                var result = [];
                Ext.each(Ext.Object.getKeys(records[0].raw), function (item, index, allItems) {
                    if (item !== 'date') {
                        result.push(item);
                    }
                });
                return result;
            }()),
            seriesBase = {
                type: 'line',
                axis: 'left',
                xField: 'date',
                style: {
                    'stroke-width': 3
                },
                markerConfig: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                }
            },
            seriesArray = [],
            obj;

        if (success) {
            me.surface.removeAll();
            me.axes.addAll([
                {
                    type: 'Numeric',
                    minimum: 0,
                    position: 'left',
                    fields: seriesNames,
                    title: false,
                    grid: true,
                    label: {
                        renderer: Ext.util.Format.numberRenderer('0,0'),
                        font: '10px Arial'
                    }
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['date'],
                    title: false,
                    label: {
                        renderer: function (v) {
                            return Ext.Date.format(v, 'm/d/Y');
                        },
                        font: '11px Arial'
                    }
                }
            ]);

            if (me.series.length > 0) {
                me.series.clear();
            }
            Ext.each(seriesNames, function (item, index, allItems) {
                obj = Ext.clone(seriesBase);
                Ext.apply(obj, {
                    yField: [item]
                });
                Ext.apply(obj.style, {
                    fill: me.lineColors[index],
                    stroke: me.lineColors[index]
                });
                Ext.apply(obj.markerConfig, {
                    fill: me.lineColors[index],
                    stroke: me.lineColors[index]
                });

                seriesArray.push(Ext.apply({}, obj));
            });

            me.series.addAll(seriesArray);

            me.redraw();
        } else {
            Dashboard.manager.Error.displayError(me.errorRetrievingTrendCountText);
        }
    }
});
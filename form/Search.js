Ext.define('Dashboard.form.Search', {
    extend: 'Ext.form.Panel',
    alias: 'widget.searchform',

    statics: {
        serialNumber: 'serialNumber',
        partyNumber: 'partyNumber',
        fileId: 'fileId',
        srNumber: 'srNumber',
        serviceProvider: 'serviceProvider'
    },

    initComponent: function () {
        var me = this;

        Ext.apply(this, Ext.applyIf(this.initialConfig, {

            xtype: 'form',
            bodyStyle: 'padding:5px 5px 0',
            width: '100%',
            fieldDefaults: {
                labelAlign: 'left',
                msgTarget: 'side'
            },

            layout: 'hbox',
            defaults: {
                margin: '5 15 15 15',
                border: 0
            },
            items: [
                {
                    defaults: {
                        width: 290,
                        labelWidth: 80,
                        maskRe: /^[0-9a-zA-Z*.]+$/
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Serial Number',
                            anchor: '-5',
                            name: Dashboard.form.Search.serialNumber
//                            ,
//                            value: 'APM363FE*'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Site Number',
                            anchor: '-5',
                            name: Dashboard.form.Search.partyNumber
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'File ID',
                            anchor: '-5',
                            name: Dashboard.form.Search.fileId
                        }
                    ]
                },
                {
                    defaults: {
                        maskRe: /^[0-9a-zA-Z*.]+$/,
                        width: 350,
                        labelWidth: 140
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Service Request Number',
                            anchor: '100%',
                            name: Dashboard.form.Search.srNumber
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Service Provider',
                            anchor: '100%',
                            name: Dashboard.form.Search.serviceProvider
                        },
                        {
                            xtype: 'fieldset',
                            title: Dashboard.model.SearchCriteria.maximumPast30DaysText,
                            collapsible: false,
                            width: 360,
                            margins: '10 0 0 0',
                            defaults: {
                                labelWidth: 130,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                }
                            },
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: 'From',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    layout: 'hbox',
                                    defaults: {
                                        flex: 1,
                                        hideLabel: true
                                    },
                                    items: [
                                        {
                                            xtype: 'datefield',
                                            name: 'fromDate',
                                            fieldLabel: 'From',
                                            margin: '0 5 0 0',
                                            listeners: {
                                                change: function (c, newValue, oldValue, eOpts) {
                                                    me.setValidateDateTime('from', c.getValue(), me.ownerCt.query('timefield[name=fromTime]')[0].getValue(), me.ownerCt.query('datefield[name=toDate]')[0].getValue(), me.ownerCt.query('timefield[name=toTime]')[0].getValue());
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'timefield',
                                            name: 'fromTime',
                                            fieldLabel: 'Time',
                                            minValue: '12:00 AM',
                                            maxValue: '11:00 PM',
                                            increment: 60,
                                            listeners: {
                                                change: function (c, newValue, oldValue, eOpts) {
                                                    me.setValidateDateTime('from', me.ownerCt.query('datefield[name=fromDate]')[0].getValue(), c.getValue(), me.ownerCt.query('datefield[name=toDate]')[0].getValue(), me.ownerCt.query('timefield[name=toTime]')[0].getValue());
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'hidden',
                                            flex: 0,
                                            name: 'from'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: 'To',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    layout: 'hbox',
                                    defaults: {
                                        flex: 1,
                                        hideLabel: true
                                    },
                                    items: [
                                        {
                                            xtype: 'datefield',
                                            name: 'toDate',
                                            fieldLabel: 'To',
                                            margin: '0 5 0 0',
                                            listeners: {
                                                change: function (c, newValue, oldValue, eOpts) {
                                                    me.setValidateDateTime('to', me.ownerCt.query('datefield[name=fromDate]')[0].getValue(), me.ownerCt.query('timefield[name=fromTime]')[0].getValue(), c.getValue(), me.ownerCt.query('timefield[name=toTime]')[0].getValue());
                                                }

                                            }
                                        },
                                        {
                                            xtype: 'timefield',
                                            name: 'toTime',
                                            fieldLabel: 'Time',
                                            minValue: '12:00 AM',
                                            maxValue: '11:00 PM',
                                            increment: 60,
                                            listeners: {
                                                change: function (c, newValue, oldValue, eOpts) {
                                                    me.setValidateDateTime('to', me.ownerCt.query('datefield[name=fromDate]')[0].getValue(), me.ownerCt.query('timefield[name=fromTime]')[0].getValue(), me.ownerCt.query('datefield[name=toDate]')[0].getValue(), c.getValue());
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'hidden',
                                            name: 'to',
                                            flex: 0
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    layout: 'vbox',
                    margin: '5 0 15 25',
                    defaults: {
                        xtype: 'button',
                        width: 140,
                        margin: '5 0 0 0'
                    },
                    items: [
                        {
                            text: 'Search'
                        },
                        {
                            text: 'Reset'
                        }
                    ]
                }
            ]
        }));

        this.callParent();
    },

    setValidateDateTime: function (origin, fromDate, fromTime, toDate, toTime) {
        var me = this,
            errors = new Ext.data.Errors(),
            from = Dashboard.util.Date.parseTimestamp(Dashboard.util.Date.getTimestamp(fromDate, fromTime)),
            to = Dashboard.util.Date.parseTimestamp(Dashboard.util.Date.getTimestamp(toDate, toTime)),
            originField = this.query('hidden[name=' + origin + ']')[0];

        if ((origin === 'from') ? from : to) {
            originField.setValue(Dashboard.util.Date.toTimestampString((origin === 'from') ? from : to));

            Dashboard.model.SearchCriteria.isGreaterThanToday((origin === 'from') ? from : to, origin + 'Date', errors);
            Dashboard.model.SearchCriteria.isBeyondMaximum((origin === 'from') ? from : to, errors);
            Dashboard.model.SearchCriteria.isFromGreaterThanTo((origin === 'from') ? from : to, to, errors);

            Ext.defer(function () {
                me.getForm().markInvalid(errors.items);
            }, 200);
        }
    }
});
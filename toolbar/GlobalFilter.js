/**
 * @class Dashboard.toolbar.GlobalFilter
 *
 * @extends Ext.form.Panel
 */
Ext.define('Dashboard.toolbar.GlobalFilter', {
    extend: 'Ext.form.Panel',
    alias: 'widget.globalfilter',

    // Text values
    button1Text: 'Save and Apply Filters',
    button2Text: 'Apply Filters without Save',
    button3Text: 'Restore to Saved Filters',
    button4Text: 'Reset to Default Filters',
    lastSavedText: 'Last Saved Filters on',

    globalFilterParams: ['productTypes', 'fileTypes', 'transportTypes', 'partnerTypes'],

    initComponent: function () {
        var me = this,
            baseGrid = {
                xtype: 'gridpanel',
                columns: [
                    {text: "All", flex: 1, dataIndex: 'value', sortable: false}
                ],
                columnLines: false,
                height: 150,
                frame: true,
                header: true,
                iconCls: 'icon-grid'
            };

        Ext.apply(this, Ext.applyIf(this.initialConfig, {
            defaults: {
                margin: '10 5 10 5',
                width: '100%',
                border: 0
            },
            border: 0,
            width: 230,
            autoScroll: true,
            padding: '0 5 0 5'
        }));

        this.callParent();

        this.add([
            { // container required for managing layout width
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: this.lastSavedText,
                        itemId: 'lastsavedglobalfilter',
                        name: 'lastsavedglobalfilter',
                        renderer: function (value, c) {
                            return Ext.Date.format(Dashboard.util.Date.parseTimestamp(value), 'm/d/Y h:i A');
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                title: 'Select Filters',
                layout: 'vbox',
                height: 140,

                defaults: Ext.apply(Ext.apply({}, this.defaults), {
                    xtype: 'button',
                    margin: '0 0 0 0',
                    width: '100%',
                    flex: 1
                }),
                items: [
                    {
                        text: this.button1Text,
                        itemId: 'saveandapply'
                    },
                    {
                        text: this.button2Text,
                        itemId: 'apply'
                    },
                    {
                        text: this.button3Text,
                        itemId: 'restore',
                        disabled: true
                    },
                    {
                        text: this.button4Text,
                        itemId: 'reset',
                        disabled: true
                    }
                ]
            },
            Ext.apply(Ext.apply({}, baseGrid), {
                store: Dashboard.filterStores.Product,
                title: 'Product',
                name: 'productTypes',
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    listeners: {
                        selectionChange: {
                            fn: me.handleSelectionChange,
                            scope: me
                        }
                    }
                })
            }),
            Ext.apply(Ext.apply({}, baseGrid), {
                store: Dashboard.filterStores.FileType,
                title: 'File Type',
                name: 'fileTypes',
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    listeners: {
                        selectionChange: {
                            fn: me.handleSelectionChange,
                            scope: me
                        }
                    }
                })
            }),
            Ext.apply(Ext.apply({}, baseGrid), {
                store: Dashboard.filterStores.TransportType,
                title: 'Transport Type',
                name: 'transportTypes',
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    listeners: {
                        selectionChange: {
                            fn: me.handleSelectionChange,
                            scope: me
                        }
                    }
                })
            }),
            Ext.apply(Ext.apply({}, baseGrid), {
                store: Dashboard.filterStores.EmcPartner,
                title: 'EMC / Partner',
                name: 'partnerTypes',
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    listeners: {
                        selectionChange: {
                            fn: me.handleSelectionChange,
                            scope: me
                        }
                    }
                })
            })
        ]);
    },
    getActiveGlobalFilterPanel: function () {
        return this.ownerCt.ownerCt.xtype;
    },


    /**
     * Returns the grid panel values as objects within an array.
     * @returns {{}}
     */
    getGridPanelValues: function () {
        var me = this,
            result = {};

        Ext.each(this.globalFilterParams, function (item, index, allItems) {
            param = me.query('gridpanel[name=' + item + ']')[0].getSelectionModel().getSelection();
            if (param) {
                (result[item] = param);
            }
        });

        return result;
    },

    /**
     * Returns the grid panel values as comma separated values within an array.
     *
     * @param model
     * @param paramNames
     * @returns {{}}
     */
    getParamsFromModel: function (model, paramNames) {
        var me = this,
            result = {},
            paramArray;
        Ext.each(paramNames, function (item, index, allItems) {
            paramArray = [];
            Ext.each(model.data[item], function (item2, index2, allItems2) {
                if (item2.data) {
                    // item is a multiselect
                    paramArray.push(item2.data.value);
                } else {
                    // item is a single value field
                    paramArray.push(model.data[item]);
                }
            });
            result[item] = paramArray;
        });

        return result;
    },

    /**
     * Returns the parameter names within a model.
     *
     * @param model
     * @returns {Array}
     */
    getParamNamesFromModel: function (model) {
        var me = this,
            result = [];

        Ext.each(model.getFields(), function (item, index, allItems) {
            result.push(item.name);
        });

        return result;
    },

    getRecordsByValues: function (store, fieldName, values) {
        var result = [];

        Ext.each(values, function (item, index, allItems) {
            result.push(store.findRecord(fieldName, item));
        });

        return result;
    },

    getViewTypeName: function () {
        return this.query('radio[name=viewType]')[0].getValue() ? Dashboard.view.Summary.file : Dashboard.view.Summary.sr;
    },

    handleSelectionChange: function (selModel, selected, eOpts) {
        this.fireEvent('globalfilterchange');
    },

    showMask: function (condition) {
        if (!this.loadMask) {
            this.loadMask = new Ext.LoadMask(this, {
                useMsg: false
            });
        }

        this.loadMask[condition ? 'show' : 'hide']();
    },

    getState: function () {
        var model = Dashboard.app.getController('Toolbar').globalFilterModel,
            state = this.getParamsFromModel(model, model.fields.keys);

        // timestamp
        this.addPropertyToState(state, 'timestamp', Dashboard.util.Date.toTimestampString(new Date()));

        // if summary panel, get the view type
        if (this.getActiveGlobalFilterPanel() === Dashboard.controller.Toolbar.summary) {
            this.addPropertyToState(state, 'viewTypeName', this.getViewTypeName());
        } else {
            // retain the summary view type when updating the transaction global state
            this.addPropertyToState(state, 'viewTypeName', Ext.state.Manager.getProvider().get('globalfilter').viewTypeName);
        }

        return state;
    },

    applyState: function (state, type) {
        // grid controls
        Dashboard.app.getController('Toolbar').setGridControls(state);

        if (type === Dashboard.controller.Toolbar.summary) {
            // set summary view type control
            Ext.ComponentQuery.query('radio[name=viewType]')[0].setValue(state.viewTypeName ? state.viewTypeName : Dashboard.view.Summary.file);
        }

        // timestamp
        Ext.each(Ext.ComponentQuery.query('#lastsavedglobalfilter'), function (item, index, allItems) {
            item.setValue(state.timestamp);
        });

        // handle layout repositioning after grid selection
        Ext.ComponentQuery.query('radio[name=viewType]')[0].focus();
    }

});
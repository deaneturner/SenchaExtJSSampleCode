Ext.define('Dashboard.controller.Toolbar', {
    extend: 'Ext.app.Controller',

    models: [
        'GlobalFilterCriteria',
        'AdditionalCriteria'
    ],

    statics: {
        summary: 'summary',
        transaction: 'transaction',
        applyFilters: 'applyFilters'
    },

    refs: [
        {
            ref: 'transactionGlobalFilter',
            selector: 'transaction globalfilter'
        },
        {
            ref: 'summaryGlobalFilter',
            selector: 'summary globalfilter'
        },
        {
            ref: 'applyFilterButtonTransaction',
            selector: 'transaction #apply'
        },
        {
            ref: 'saveApplyFilterButtonTransaction',
            selector: 'transaction #saveandapply'
        },
        {
            ref: 'restoreFilterButtonTransaction',
            selector: 'transaction #restore'
        },
        {
            ref: 'resetFilterButtonTransaction',
            selector: 'transaction #reset'
        },
        {
            ref: 'applyFilterButtonSummary',
            selector: 'summary #apply'
        },
        {
            ref: 'saveApplyFilterButtonSummary',
            selector: 'summary #saveandapply'
        },
        {
            ref: 'restoreFilterButtonSummary',
            selector: 'summary #restore'
        },
        {
            ref: 'resetFilterButtonSummary',
            selector: 'summary #reset'
        },
        {
            ref: 'statusToolbar',
            selector: 'transaction statustoolbar'
        }
    ],

    init: function (application) {

        var me = this,
            storesToLoad = ['Product', 'FileType', 'TransportType', 'EmcPartner'];

        this.control({
            'transaction form': {
                globalfilterchange: function (opts) {
                    // set the model
                    this.setGlobalFilterModel(Dashboard.controller.Toolbar.transaction);

                    // set the other panel's global filter state
                    this.syncGlobalFilterControls(this.getOppositeGlobalFilterPanelType(Dashboard.controller.Toolbar.transaction));

                    this.setGlobalFilterButtonState(Dashboard.controller.Toolbar.transaction);
                }
            },
            'summary form': {
                globalfilterchange: function (opts) {
                    // set the model
                    this.setGlobalFilterModel(Dashboard.controller.Toolbar.summary);

                    // set the other panel's global filter state
                    this.syncGlobalFilterControls(this.getOppositeGlobalFilterPanelType(Dashboard.controller.Toolbar.summary));

                    this.setGlobalFilterButtonState(Dashboard.controller.Toolbar.summary);
                }
            },

            'summary #restore': {
                click: function (btn, e, eOpts) {
                    me.getSummaryGlobalFilter().applyState(Ext.state.Manager.getProvider().get('globalfilter'), Dashboard.controller.Toolbar.summary);
                }
            },

            'summary #reset': {
                click: function (btn, e, eOpts) {
                    me.getSummaryGlobalFilter().applyState(Dashboard.app.getController('Toolbar').defaultState, Dashboard.controller.Toolbar.summary);
                }
            },

            'transaction #restore': {
                click: function (btn, e, eOpts) {
                    me.getSummaryGlobalFilter().applyState(Ext.state.Manager.getProvider().get('globalfilter'));
                }
            },

            'transaction #reset': {
                click: function (btn, e, eOpts) {
                    me.getSummaryGlobalFilter().applyState(Dashboard.app.getController('Toolbar').defaultState);
                }
            }

        });

        /*
         * Global Filter Stores
         */
        Dashboard.filterStores = {};
        Ext.each(storesToLoad, function (item, index, allItems) {
            Dashboard.filterStores[item] = Ext.create('Dashboard.store.' + item, {
                autoLoad: true,
                listeners: {
                    load: function (store, records, successful, eOpts) {
                        me.loadGlobalFilterControls(storesToLoad, item);
                    }
                }
            });
        });

        // global filter model
        this.globalFilterParams = this.getParamNamesFromModel(Dashboard.model.GlobalFilterCriteria);
        this.globalFilterModel = {};

        // additional criteria model (drill down)
        this.additionalModelParams = this.getParamNamesFromModel(Dashboard.model.AdditionalCriteria);
        this.additionalModel = {};

        // set the new as of: timestamp
        Ext.state.Manager.getProvider().on('statechange', function (provider, stateId, state) {
            if (stateId === 'globalfilter') {
                me.getSummaryGlobalFilter().getForm().findField('lastsavedglobalfilter').setValue(state.timestamp);
                me.getTransactionGlobalFilter().getForm().findField('lastsavedglobalfilter').setValue(state.timestamp);
            }
        });

        this.addEvents(Dashboard.controller.Toolbar.applyFilters);
    },

    onLaunch: function () {
        var me = this;

        /*
         * SELECT FILTERS - Button Actions
         */

        // TRANSACTION

        // Save and Apply Filters
        this.getSaveApplyFilterButtonTransaction().on({
            click: function (btn, e, eOpts) {
                // Save
                Ext.state.Manager.getProvider().set('globalfilter', me.getTransactionGlobalFilter().getState());

                // set timestamps
                if (me.globalFilterModel.applyFilterTimestamp !== me.globalFilterModel.changeFilterTimestamp) {
                    me.globalFilterModel.applyFilterTimestamp = me.globalFilterModel.changeFilterTimestamp;

                    me.fireEvent(Dashboard.controller.Toolbar.applyFilters, {
                        viewTypeName: Dashboard.controller.Toolbar.transaction
                    });
                }

                // enable Reset, Restore to Saved Filters
                me.enableSavedFilterStatus(true);
            }
        });

        // Apply Filters without Save
        this.getApplyFilterButtonTransaction().on({
            click: function (btn, e, eOpts) {
                // set timestamps
                if (me.globalFilterModel.applyFilterTimestamp !== me.globalFilterModel.changeFilterTimestamp) {
                    me.globalFilterModel.applyFilterTimestamp = me.globalFilterModel.changeFilterTimestamp;

                    me.fireEvent(Dashboard.controller.Toolbar.applyFilters, {
                        viewTypeName: Dashboard.controller.Toolbar.transaction
                    });
                }
            }
        });

        // SUMMARY
        // Save and Apply Filters
        this.getSaveApplyFilterButtonSummary().on({
            click: function (btn, e, eOpts) {
                // Save
                Ext.state.Manager.getProvider().set('globalfilter', me.getSummaryGlobalFilter().getState());

                // set timestamps
                if (me.globalFilterModel.applyFilterTimestamp !== me.globalFilterModel.changeFilterTimestamp) {
                    me.globalFilterModel.applyFilterTimestamp = me.globalFilterModel.changeFilterTimestamp;

                    me.fireEvent(Dashboard.controller.Toolbar.applyFilters, {
                        viewTypeName: me.getSummaryGlobalFilter().getViewTypeName()
                    });
                }

                // enable Reset, Restore to Saved Filters
                me.enableSavedFilterStatus(true);
            }
        });

        // Apply Filters without Save
        this.getApplyFilterButtonSummary().on({
            click: function (btn, e, eOpts) {
                me.fireEvent(Dashboard.controller.Toolbar.applyFilters, {
                    viewTypeName: me.getSummaryGlobalFilter().getViewTypeName()
                });
            }
        });
    },

    enableSavedFilterStatus: function (enable) {
        var action = ((enable || enable === undefined) ? 'enable' : 'disable');

        // summary
        this.getRestoreFilterButtonSummary()[action]();
        this.getResetFilterButtonSummary()[action]();

        // transaction
        this.getRestoreFilterButtonTransaction()[action]();
        this.getResetFilterButtonTransaction()[action]();
    },

    getAdditionalModel: function () {
        return this.additionalModel;
    },

    getGlobalFilterModel: function () {
        return this.globalFilterModel;
    },

    getGlobalFilterPanelByType: function (type) {
        return (type === Dashboard.controller.Toolbar.transaction) ? this.getTransactionGlobalFilter() : this.getSummaryGlobalFilter();
    },

    getAdditionalModelParams: function () {
        return this.getParamsFromModel(this.getAdditionalModel(), this.additionalModelParams);
    },

    getGlobalFilterModelParams: function () {
        return this.getParamsFromModel(this.getGlobalFilterModel(), this.globalFilterParams);
    },

    getGridPanelNames: function () {
        var excludes = ['viewTypeName', 'id'],
            result = Ext.Array.clone(this.globalFilterParams);
        if (!this.gridPanelNames) {
            Ext.each(this.globalFilterParams, function (item, index, allItems) {
                if (Ext.Array.contains(excludes, item)) {
                    Ext.Array.remove(result, item);
                }
            });
            this.gridPanelNames = result;
        }

        return this.gridPanelNames;
    },

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

    getParamNamesFromModel: function (model) {
        var me = this,
            result = [];

        Ext.each(model.getFields(), function (item, index, allItems) {
            result.push(item.name);
        });

        return result;
    },

    getOppositeGlobalFilterPanelType: function (type) {
        return (type === Dashboard.controller.Toolbar.transaction) ? Dashboard.controller.Toolbar.summary : Dashboard.controller.Toolbar.transaction;
    },

    getParamFromSelection: function (modelArray) {
        var result = [];
        Ext.each(modelArray, function (item, index, allItems) {
            result.push(item.get('value'));
        });

        return result;
    },

    getRecordsByValues: function (store, values) {
        var result = [],
            rec;

        Ext.each(values, function (item, index, allItems) {
            rec = store.findRecord('value', item);
            if (rec) {
                result.push(rec);
            }
        });

        return result;
    },


    loadGlobalFilterControls: function (storesToLoad, storeName) {
        Ext.Array.remove(storesToLoad, storeName);
        if (!storesToLoad.length) {
            this.setInitialControlState();
        }
    },

    maskGlobalFilterToolbar: function (type, condition) {
        if (type === Dashboard.controller.Toolbar.transaction) {
            if (!Ext.isEmpty(this.additionalCriteria)) { // drill down state requires global filter to be masked
                this.getTransactionGlobalFilter().showMask(condition);
            }
        }
    },

    setAdditionalCriteriaModel: function (type, obj) {
        // start with a empty model, replace existing.
        this.additionalModel = Ext.create(this.getAdditionalCriteriaModel());
        this.viewTypeName = type;
        Ext.apply(this.additionalModel.data, obj);
    },

    getValueArrayFromStore: function (store) {
        var result = [];

        Ext.each(store.data.items, function (item, index, allItems) {
            result.push(item.get('value'));
        });

        return result;
    },

    setGridControls: function (state) {
        var suppressEvent = true;  // necessary for affecting position of grid control selection (defaults to end of the list otherwise)
        // grid controls
        Ext.ComponentQuery.query('gridpanel[name=partnerTypes]')[0].getSelectionModel().select(this.getRecordsByValues(Dashboard.filterStores.EmcPartner, state.partnerTypes), false, suppressEvent);
        Ext.ComponentQuery.query('gridpanel[name=transportTypes]')[0].getSelectionModel().select(this.getRecordsByValues(Dashboard.filterStores.TransportType, state.transportTypes), false, suppressEvent);
        Ext.ComponentQuery.query('gridpanel[name=fileTypes]')[0].getSelectionModel().select(this.getRecordsByValues(Dashboard.filterStores.FileType, state.fileTypes), false, suppressEvent);
        Ext.ComponentQuery.query('gridpanel[name=productTypes]')[0].getSelectionModel().select(this.getRecordsByValues(Dashboard.filterStores.Product, state.productTypes), false, suppressEvent);

        // necessary for affecting position of grid control selection (defaults to end of the list otherwise)
        this.getSummaryGlobalFilter().fireEvent('globalfilterchange');
    },

    setInitialControlState: function () {
        var me = this,
            state;

        this.defaultState = {
            viewTypeName: 'file',
            productTypes: (function () {
                return me.getValueArrayFromStore(Dashboard.filterStores.Product);
            }()),
            fileTypes: (function () {
                return me.getValueArrayFromStore(Dashboard.filterStores.FileType);
            }()),
            transportTypes: (function () {
                return me.getValueArrayFromStore(Dashboard.filterStores.TransportType);
            }()),
            partnerTypes: 'EMC'
        };

        if (Ext.state.Manager.getProvider().get('globalfilter')) {
            this.enableSavedFilterStatus();
        }

        state = Ext.state.Manager.getProvider().get('globalfilter', this.defaultState);

        this.getSummaryGlobalFilter().applyState(state, Dashboard.controller.Toolbar.summary);

        Dashboard.app.getController('Query').setCriteriaListeners();

        me.fireEvent(Dashboard.controller.Toolbar.applyFilters, {
            viewTypeName: state.viewTypeName
        });
    },

    setGlobalFilterModel: function (type) {
        var me = this,
            param,
            globalFilterGridPanelValues = this.getGlobalFilterPanelByType(type).getGridPanelValues();

        // start with a empty model, replace existing.
        this.globalFilterModel = Ext.create(this.getGlobalFilterCriteriaModel());

        // view type
        this.viewTypeName = type;

        // load params
        Ext.each(me.globalFilterParams, function (item, index, allItems) {
            me.globalFilterModel.set(item, globalFilterGridPanelValues[item]);
        });
        if (type === Dashboard.controller.Toolbar.summary) {
            me.globalFilterModel.set('viewTypeName', (this.getSummaryGlobalFilter().getViewTypeName()));
        }

        // update timestamp
        this.globalFilterModel.changeFilterTimestamp = new Date();
    },

    /**
     * Synchronizes control states across global filter instances.
     *
     * @param target {String} The parent to affect the new control state.
     * @param source {String} The parent acting as the source of control state.
     */
    syncGlobalFilterControls: function (target) {
        var me = this,
            name,
            selector,
            sourceGlobalFilterPanel,
            targetGlobalFilterPanel;

        /*
         * Identify originating and opposite panels
         */
        Ext.each(Ext.ComponentQuery.query('globalfilter'), function (item, index, allItems) {
            if (item.ownerCt.ownerCt.xtype === target) {
                targetGlobalFilterPanel = item;
            } else if (item.ownerCt.ownerCt.xtype === me.getOppositeGlobalFilterPanelType(target)) {
                sourceGlobalFilterPanel = item;
            }
        });

        if (targetGlobalFilterPanel.rendered) {
            Ext.each(this.getGridPanelNames(), function (item, index, allItems) {
                selector = 'gridpanel[name=' + item + ']';
                targetGlobalFilterPanel.query(selector)[0].getSelectionModel().select(sourceGlobalFilterPanel.query(selector)[0].getSelectionModel().getSelection(), false, true);
            });
        }
    },

    setGlobalFilterButtonState: function (type) {
        var action,
            allControlsEmpty = true,
            applyBtns = Ext.ComponentQuery.query('globalfilter #apply'),
            saveApplyBtns = Ext.ComponentQuery.query('globalfilter #saveandapply');

        // examine controls for empty state
        Ext.each(this.getGlobalFilterPanelByType(type).query('gridpanel'), function (item, index, allItems) {
            if (item.getSelectionModel().getSelection().length > 0) {
                allControlsEmpty = false;
                return false;
            }

        });

        // disable or enable if all controls empty
        action = allControlsEmpty ? 'disable' : 'enable';
        Ext.each(applyBtns, function (item, index, allItems) {
            item[action]();
        });
        Ext.each(saveApplyBtns, function (item, index, allItems) {
            item[action]();
        });
    }
});
Ext.define('Dashboard.state.RemoteStorageProvider', {
    extend: 'Ext.state.Provider',
    alias: 'widget.remotestorageprovider',

    mixins: {
        observable: 'Ext.util.Observable'
    },
    uses: [
        'Ext.data.Model',
        'Ext.data.Store',
        'Ext.state.Provider',
        'Ext.util.Observable'
    ],

    errorRetrievingStateText: 'An error has occurred retrieving the global filter state.',
    errorSavingStateText: 'An error has occurred saving the global filter state.',
    errorClearingStateText: 'An error has occurred clearing the global filter state.',

    store: {},

    constructor: function (config) {
        var me = this;

        config = config || {};
        this.initialConfig = config;

        Ext.apply(this, config);

        this.store = this.storage();

        // first connection needs to by synchronous on bootstrap, otherwise no guarantee state is loaded before component state init.
        Ext.data.Connection.prototype.async = false;

        this.store.load();

        Ext.data.Connection.prototype.async = true;

        this.mixins.observable.constructor.call(this, config);
    },

    /**
     * @private
     * @param stateId
     * @param state {Object} An object containing the property/value pairs e.g. {"columns":[{"id":"h1"}...id":"h4"},{"id":"h5"}]}
     */
    set: function (stateId, state) {
        var me = this;

        // update
        this.allStates[stateId] = state;

        // apply params and post
        Ext.apply(this.store.proxy.extraParams, {
            preferences: this.encodeValue(this.allStates)
        });
        this.store.load({
            action: 'update',
            callback: function (records, operation, success) {
                if (!success) {
                    Dashboard.manager.Error.displayError(me.errorSavingStateText);
                }
            }
        });

        this.fireEvent('statechange', this, stateId, state);
    },

    get: function (stateId, defaultValue) {
        var result,
            preferences,
            isPreferencesInDb = true;

        if (!this.store.data.items[0]) {
            Dashboard.manager.Error.displayError(this.errorRetrievingStateText);

            this.allStates = {
                globalfilter: Dashboard.app.getController('Toolbar').defaultState,
                transactiongrid: Dashboard.app.getController('Transaction').defaultState
            };

            result = this.allStates[stateId];
        } else {
            // decode the entry in the database (once)
            if (!this.allStates) {
                preferences = this.decodeValue(this.store.data.items[0].data.preferences);
                if (preferences) {
                    // user preferences exist in db
                    this.allStates = preferences;
                } else {
                    // no user preferences exist in db
                    isPreferencesInDb = false;
                    this.allStates = {
                        globalfilter: Dashboard.app.getController('Toolbar').defaultState,
                        transactiongrid: Dashboard.app.getController('Transaction').defaultState
                    };
                }

            }

            if (isPreferencesInDb && this.allStates && this.allStates[stateId]) {
                result = this.allStates[stateId];

            } else if (defaultValue) {

                result = defaultValue;
            }
        }

        return result;
    },

    clear: function (stateId) {
        var me = this;

        if (this.allStates[stateId]) {

            delete this.allStates[stateId];

            // apply params and post
            Ext.apply(this.store.proxy.extraParams, {
                preferences: this.encodeValue(this.allStates)
            });

            this.store.load({
                action: 'update',
                callback: function (records, operation, success) {
                    if (!success) {
                        Dashboard.manager.Error.displayError(me.errorClearingStateText);
                    }
                }
            });
        }

    },

    storage: Ext.emptyFn
});
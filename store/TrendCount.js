/**
 * @class Dashboard.store.TrendCount
 * @extends Ext.data.Store
 */
Ext.define('Dashboard.store.TrendCount', {
    model: 'Dashboard.model.TrendCount',
    extend: 'Ext.data.Store',

    errorRetrievingTrendCountText: 'An error has occurred retrieving trend count data.',

    initComponent: function () {
        /**
         * @event dynamicload
         *
         * Fired after the store has been dynamically configured and loaded.
         * @param {Ext.data.Model[]} records An array of records based on the dynamic model.
         * @param {Ext.data.Operation} operation The operation object.
         * @param {Boolean} successful True if the operation was successful.
         */
        this.addEvents('dynamicload');
    },

    /*
     * Dynamically creates a model and loads the store with the raw json data.
     *
     * @param {Object} options The option for the first field, defaultTypes, conversions, etc.
     */
    loadDynamically: function (options) {
        var me = this;

        this.load(Ext.apply(options || {}, {

            callback: function (records, operation, success) {
                var rec;
                if (success) {
                    this.generateModelAndLoad(this, this.firstFieldConfig);

                    rec = records;
                } else {
                    rec = Dashboard.manager.Error.getErrors(records, operation);
                    Ext.manager.Error.logErrors(rec);
                    Dashboard.manager.Error.displayError(me.errorRetrievingTrendCountText);
                }

                this.fireEvent('dynamicload', rec, operation, success);
            }
        }));
    },

    /**
     * Generates the fields and loads the model.
     *
     * @param store {Ext.data.Model} The store from which to generate the model and reload.
     * @param config {Object} An object configuration use to define default types and first field metadata.
     */
    generateModelAndLoad: function (store, config) {
        if (store.data.length === 0) {
            throw new Error('No data found for creating model fields');
        }

        var propertyNames = [],
            fieldArray = [],
            x,
            k,
            type,
            returnValue = function (v) {
                return v;
            },
            obj = store.data.items[0].raw;

        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                propertyNames.push(k);
            }
        }

        /*
         * Build the field definitions.
         */
        for (x = 0; x < propertyNames.length; x += 1) {
            if (propertyNames[x] === config.id) {
                type = config.type;
            } else {
                type = (config.defaultType || 'int');
            }

            if (x === 0) {
                fieldArray.push({name: propertyNames[x], type: type, convert: (config.convert || returnValue)});
            } else {
                fieldArray.push({name: propertyNames[x], type: type, convert: (config.defaultConvert || returnValue)});
            }
        }

        fieldArray.push({name: 'id', type: 'int'});

        /*
         * Set the model fields.
         */
        store.model.setFields(fieldArray, propertyNames[0]);

        /*
         * Reload the data using the current raw data.
         */
        store.filterOnLoad = false; // avoid bug on data load - i.e. empty filter function exception
        store.loadRawData(store.proxy.reader.jsonData);
    }
});
/**
 * @class com.intellij.lang.javascript.index.MyJSNamedItem@5b722
 *
 * @extends Ext.form.FieldSet
 */
Ext.define('Dashboard.form.SearchFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.searchfieldset',
    mixins: ['Ext.util.Observable'],

    serialNumText: 'Serial Number',
    partyNumText: 'Party Number',
    fileId: 'File ID',
    srNumText: 'SR Number',
    serviceProviderText: 'Service Provider',

    initComponent: function () {

        Ext.apply(this, Ext.applyIf(this.initialConfig, {
            title: 'Search CLM',
            layout: 'hbox',
            height: 50,
            defaults: {
                margins: '0 5 0 5'
            },
            items: [
                {
                    xtype: 'combobox',
                    width: 120,
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        model: 'Dashboard.model.KeyValue',
                        data: [
                            {key: Dashboard.form.Search.serialNumber, value: this.serialNumText},
                            {key: Dashboard.form.Search.partyNumber, value: this.partyNumText},
                            {key: Dashboard.form.Search.fileId, value: this.fileId},
                            {key: Dashboard.form.Search.srNumber, value: this.srNumText},
                            {key: Dashboard.form.Search.serviceProvider, value: this.serviceProviderText}
                        ]
                    }),
                    displayField: 'value',
                    valueField: 'key',
                    value: Dashboard.form.Search.serialNumber,
                    listeners: {
                        change: function (c, newValue, oldValue, eOpts) {
                            c.ownerCt.query('#quicksearch')[0].clearInvalid();
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    itemId: 'quicksearch',
                    width: 160,
                    allowBlank: false,
                    blankText: 'Please enter a criteria value.',
                    msgTarget: 'side',
                    maskRe: /^[0-9a-zA-Z*.]+$/,
                    listeners: {
                        focus: function (c, The, eOpts) {
                            c.clearInvalid();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'Go',
                    listeners: {
                        click: {
                            fn: function (btn, e, eOpts) {
                                var textField = this.query('#quicksearch')[0],
                                    comboValue = this.query('combobox')[0].getValue(),
                                    searchValue = textField.getValue(),
                                    result = {};
                                if (textField.validate()) {
                                    result[comboValue] = searchValue;
                                    this.fireEvent('quicksearch', result);
                                }
                            },
                            scope: this
                        }
                    }
                }
            ]
        }));

        this.callParent();

        this.addEvents('quickSearch');
    }
});
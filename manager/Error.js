/**
 * @class Dashboard.manager.Error
 *
 * A manager for processing errors.
 * <p>
 *      <ul>
 *          <li>Template for displaying error object properties.</li>
 *          <li>Retrieves errors from server-side response {success: false...}.</li>
 *          <li>Initiates a UI response to fatal errors - notifies the global exception handler for processing.</li>
 *          <li>Initiates a UI response to non-fatal errors.  Displays the a given display panel with a set of field errors.
 *     </ul>
 * </p>
 *
 *      store.load({
 *          callback: function (records, operation, success) {
 *               if (success) {
 *                   // do something
 *               }
 *               else {
 *                   // NON-FATAL: display non-fatal error(s) in a UI container.
 *                   Dashboard.manager.displayErrors(container, Dashboard.manager.Error.getErrors(records, operation), Dashboard.manager.ERROR_TYPE_NONFATAL;
 *
 *                   // OR
 *
 *                   // FATAL: display fatal error(s) in a delegated container.
 *                   Dashboard.manager.Error.notify(Dashboard.manager.Error.getErrors(records, operation);
 *               }
 *          }
 *       });
 *
 * <p>
 *     JSON for a non-fatal server response:
 * </p>
 *
 *      {"success":false,"errors":{"id":"0", "msg":"An error message.", "options":{"prop1":"value1","prop2":"value2"}}}
 *      {"success":false,"errors":[{"id":"0", "msg":"An error message.", "options":{"prop1":"value1","prop2":"value2"}},{"success":false,"errors":{"id":"1", "msg":"An error message 1.", "options":{"prop11":"value11","prop21":"value21"}}}]}
 *
 */
Ext.define('Dashboard.manager.Error', {
    statics: {
        SERVER_ERROR_ID: 'ServerError',
        ERRORS_ROOT: 'errors',
        ERROR_TYPE_NONFATAL: 'non-fatal',

        /**
         * Template for displaying error object properties.
         *      '<table width="400" height="100%" border="0">',
         *          '<tr><td>&nbsp;</td></tr>',
         *          '<tpl for=".">',
         *              '<tr class="errorMsgBody"><td>&nbsp</td>',
         *                  '<td>{message}</td>',
         *              '</tr>',
         *              '<tr><td>&nbsp</td>',
         *                  '<td>{id}</td>',
         *              '</tr>',
         *          '</tpl>',
         *          '<tr><td>&nbsp;</td></tr>',
         *      '</table>'
         *
         *
         * @property {Ext.XTemplate}
         */
        tpl: Ext.create('Ext.XTemplate',
            '<table width="400" height="100%" border="0">',
            '<tr><td>&nbsp;</td></tr>',
            '<tpl for=".">',
            '<tr class="errorMsgBody"><td>&nbsp</td>',
            '<td>{message}</td>',
            '</tr>',
            '<tr><td>&nbsp</td>',
            '<td>{id}</td>',
            '</tr>',
            '</tpl>',
            '<tr><td>&nbsp;</td></tr>',
            '</table>'),


        /**
         * Returns the errors on a given AJAX response.
         *
         * @param operation {Object} The operation returned by the AJAX response.
         * @param root {String} The root JSON property containing the errors array.
         *
         * @returns {Array} An array of error objects
         */
        getErrors: function (records, operation, root) {
            if (!root) {
                root = Dashboard.manager.Error.ERRORS_ROOT;
            }
            var result,
                msg = 'Dashboard.manager.Error.getErrors() - Operation is null or empty!';
            if (operation) {
                if (operation.request.scope.reader.jsonData && operation.request.scope.reader.jsonData[root]) {
                    result = operation.request.scope.reader.jsonData[root];
                } else if (Dashboard.manager.Error.errorObject) {
                    result = Dashboard.manager.Error.errorObject;
                }
            } else if (records.request.operation) {
                if (records.request.operation.request.scope.reader.jsonData && records.request.operation.request.scope.reader.jsonData[root]) {
                    result = records.request.operation.request.scope.reader.jsonData[root];
                } else if (Dashboard.manager.Error.errorObject) {
                    /*
                     * Last resort - use the default error object.
                     */
                    result = Dashboard.manager.Error.errorObject;
                }
            } else {
                Ext.Error.raise(msg);
                result = {"errors": [
                    {"id": "No Error ID", "msg": msg}
                ]};
            }
            return result;
        },

        /**
         * Initiates a UI response to fatal errors.
         *
         * Fires a requestexception event which is listened for by the global exception handler.
         *
         * @param records
         * @param operation
         */
        notify: function (records, operation) {
            var op = !Ext.isEmpty(operation) ? operation : records.request.operation;
            Ext.Ajax.fireEvent('requestexception', null, op.request, op);
        },
        /**
         * Logs the error objects contained in the given array.
         *
         * @param errors {Object} An array of objects representing the errors.
         */
        logErrors: function (errors) {
            Ext.log('These errors where returned on the AJAX callback:');
            Ext.each(errors, function (item, index, allItems) {
                Ext.log(Ext.JSON.encode(item));
            });
        },

        /**
         * Initiates a UI response to non-fatal errors.
         */
        displayError: function (error) {
            Dashboard.app.getController('Main').displayError(error);
        },

        /**
         * Determines if there is a server error by inspecting the array
         * for and id = <server error id>
         *
         * @param errors {Array} An error object array.
         * @return {Boolean}
         */
        isServerError: function (errors) {
            var result = false;
            Ext.each(errors, function (item, index, allItems) {
                if (item.id === Dashboard.manager.Error.SERVER_ERROR_ID) {
                    result = true;
                    return false;
                }
            });
            return result;
        },

        /**
         * Returns the server error message.
         *
         * @return {String}
         */
        getServerErrorMessage: function () {
            return Dashboard.manager.Error.errorObject &&
                Dashboard.manager.Error.errorObject.errors[0].msg;
        },

        /**
         * Generates an error object.
         *
         * @param id {String} A unique Id for tracing the user specific error.
         * @param msg {String} The message.
         * @param options {Object} An array of payload information.  One use is to populate a parameterized string such as: A message with {1} and {2}.
         * @return {Object}
         */
        generateErrorObject: function (id, msg, options) {
            return {
                id: id,
                msg: msg,
                options: options
            };
        }
    }
});
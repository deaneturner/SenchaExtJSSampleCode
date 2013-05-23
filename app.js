/*
 This file is generated and updated by Sencha Cmd. You can edit this file as
 needed for your application, but these edits will have to be merged by
 Sencha Cmd when it performs code generation tasks such as generating new
 models, controllers or views and when running "sencha app upgrade".

 * @class Dashboard.app
 *
 * The application startup (bootstrap) file provides:
 *
 * <p>
 *      <ul>
 *          <li>A single point for message processing.  Hide, show, and share a single, consistent message box.</li>
 *          <li>A single point for logout processing.</li>
 *          <li>A single point for load mask processing.  Hide, show, and share a single load mask (bound to the body el of the application).</li>
 *          <li>Global exception handling and logging for server errors other than a successful SERVER 200 response.</li>
 *          <li>Loads data that is necessary prior to startup.  e.g. user profile and state managerment.</li>
 *     </ul>
 * </p>
 *
 */
Ext.require([
    'Dashboard.window.MessageBox',
    'Dashboard.model.UserProfile',
    'Dashboard.model.Summary',
    'Dashboard.manager.Error',
    'Dashboard.view.Viewport',
    'Dashboard.store.Product',
    'Dashboard.store.FileType',
    'Dashboard.store.TransportType',
    'Dashboard.store.EmcPartner',
    'Dashboard.state.HttpProvider'
]);

/*    Ideally changes to this file would be limited and most work would be done
 in other places (such as Controllers). If Sencha Cmd cannot merge your
 changes and its generated code, it will produce a "merge conflict" that you
 will need to resolve manually.
 */

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides
//@tag packageOverrides

Ext.onReady(function () {
    Ext.ns('Dashboard');

    /*
     * Logging
     */
    Dashboard.logging = true;
    Dashboard.log = function (options, message) {
        if (Dashboard.logging) {
            Ext.log(options, message);
        }
    };


    /*
     * GLOBAL AJAX HTTP REQUEST TIMEOUT
     */
    Ext.Ajax.timeout = 600000;
    Ext.override(Ext.form.Basic, { timeout: Ext.Ajax.timeout / 1000 });
    Ext.override(Ext.data.proxy.Server, { timeout: Ext.Ajax.timeout });
    Ext.override(Ext.data.Connection, { timeout: Ext.Ajax.timeout });

    /*
     * State Manager
     */
    Ext.state.Manager.setProvider(Ext.create('Dashboard.state.HttpProvider'));

    /**
     * Message Box
     *
     * A single point for message processing.  Hide, show, and share a single, consistent message box.
     *
     * @property {Object}
     */
    Dashboard.MessageBox = Ext.create('Dashboard.window.MessageBox');

    /**
     * Logs the user out and redirects to the proper view.
     *
     * A single point for logout processing.
     *
     * @method
     */
    Dashboard.doLogout = function () {
        Dashboard.isLoggingOut = true;
        window.location.href = 'logout';
    };


    /**
     * Global Mask
     *
     * An application level mask, bound to the the body tag of the application.
     *
     * A single point for load mask processing.  Hide, show, and share a single load mask (bound to the body el of the application).
     *
     * @property {Object}
     */
    Dashboard.loadMask = {};
    Dashboard.loadMask.show = function () {
        Ext.getBody().mask('Loading...');
    };
    Dashboard.loadMask.hide = function () {
        Ext.getBody().unmask();
    };

    /*
     * Global exception handling for fatal errors.
     */
    Ext.Ajax.on('requestexception', function (conn, request, opts) {
        // hide the mask if any
        if (Dashboard.loadMask) {
            Dashboard.loadMask.hide();
        }
        if (!Dashboard.isLoggingOut) {
            // reset
            if (Dashboard.manager.Error.errorObject) {
                delete Dashboard.manager.Error.errorObject;
            }
            if (!request.responseText) {
                /*
                 * Response does not contain an error object!
                 *
                 * Fabricate an error object.
                 */
                Dashboard.manager.Error.errorObject = {
                    success: false,
                    errors: [
                        {"title": "Server Request Exception", "msg": "The data you requested is temporarily unavailable.<br>Please try again momentarily."}
                    ]
                };
            } else {
                // error object
                try {
                    /*
                     * Server-side managed and formatted error response
                     */
                    Dashboard.manager.Error.errorObject =
                        Ext.JSON.decode(request.responseText);
                } catch (err) {
                    /*
                     * - NO managed or formatted error response -
                     * Server-side should correct this condition.
                     */
                    Dashboard.manager.Error.errorObject = {
                        success: false,
                        errors: [
                            {"id": "UNHANDLED ServerError", "msg": "Unhandled server error."}
                        ]
                    };
                }
            }
            // log
            Ext.log('Global Exception Handler - Error: ' + Dashboard.manager.Error.errorObject);
            Dashboard.MessageBox.error(Dashboard.manager.Error.errorObject);

            // log
            Ext.log('AJAX Request Exception: ' +
                Dashboard.manager.Error.errorObject.errors[0].msg);
        }
    });

    var dataToLoad = ['UserProfile'], // list of data sets to complete before launching application.
        userProfile = Ext.ModelManager.getModel('Dashboard.model.UserProfile'),

    /*
     * PRE-LOAD APPLICATION DATA
     *
     * Launch application after retrieving data required (dataToLoad).
     */
        launchOnDataReady = function (dataName) {
            // mark user profile data load complete.
            Ext.Array.remove(dataToLoad, dataName);
            // launch only if all XHR requests are complete.
            if (!dataToLoad.length) {
                initLaunchPortal();
            }
        },

        initLaunchPortal = function () {
            Ext.application({
                name: 'Dashboard',

                models: [
                    'AdditionalCriteria',
                    'CDataDetail',
                    'Count',
                    'FileDisposition',
                    'GlobalFilterCriteria',
                    'Hib',
                    'IdName',
                    'InstallBase',
                    'KeyValue',
                    'Record',
                    'RuleDetail',
                    'SearchCriteria',
                    'SrQueue',
                    'Summary',
                    'Transaction',
                    'TrendCount',
                    'TrendCountGraphical',
                    'TrendCountTabular',
                    'UserProfile'
                ],

                views: [
                    'FileSummary',
                    'Main',
                    'RulesMgmtAdmin',
                    'Search',
                    'SrSummary',
                    'Summary',
                    'Transaction',
                    'Viewport'
                ],

                stores: [
                    'CDataDetail',
                    'EmcPartner',
                    'FileType',
                    'Hib',
                    'PartnerCount',
                    'Product',
                    'RuleDetail',
                    'Search',
                    'Summary',
                    'Transaction',
                    'TransportType',
                    'TrendCount',
                    'TrendCountGraphical',
                    'TrendCountTabular'
                ],

                controllers: [
                    'Main',
                    'Query',
                    'Search',
                    'Summary',
                    'Toolbar',
                    'Transaction'
                ],

                launch: function () {
                    // assign managers
                    this.queryManager = Dashboard.manager.Query;

                    Ext.create('Dashboard.view.Viewport');
                }
            });
        };

    /*
     * User Profile
     *
     * Load the user context from XHR and initialize the user profile.
     */
    userProfile.load(0, {
        success: function (record) {
            Dashboard.userProfile = record.data;
            launchOnDataReady('UserProfile');
        },
        failure: function () {
            var errMsg = 'User Profile Error:' +
                '<br><br>' + 'Contact support';
            Ext.log(errMsg);
            Ext.Msg.alert('Error', errMsg);

            Dashboard.doLogout();
        }
    });
});
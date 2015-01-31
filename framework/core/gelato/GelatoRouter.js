/**
 * @module Framework
 */
define([], function() {
    /**
     * @class GelatoRouter
     * @extends Backbone.Router
     */
    var GelatoRouter = Backbone.Router.extend({
        /**
         * @property activePage
         * @type GelatoPage
         */
        activePage: null,
        /**
         * @method after
         */
        after: function() {},
        /**
         * @method before
         */
        before: function() {
            if (this.activePage) {
                this.activePage.remove();
            }
        },
        /**
         * @method start
         */
        start: function() {
            Backbone.history.start({pushState: app.getPushState(), root: app.getRoot()});
        }
    });

    return GelatoRouter;

});
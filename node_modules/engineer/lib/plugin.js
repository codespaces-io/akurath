var events = require('events');
var util = require('util');
var _ = require('underscore');
var Q = require('q');


var Plugin = function(config, app) {
    var that = this;
    _.extend(this, config);
    this.app = app;

    // Load the plugin
    this.load = function() {
        var deferred = Q.defer();
        var imports = {};

        if (that.consumes) {
            that.consumes.forEach(function (name) {
                imports[name] = that.app.services[name];
            });
        }

        var register = function(err, services) {
            if (err) {
                deferred.reject(err);
                return;
            }

            // check services provided
            var failed = false;
            _.each(that.provides, function(toProvide) {
                if (!services[toProvide]) {
                    var err = new Error("Plugin failed to provide " + toProvide + " service.");
                    failed = true;
                    deferred.reject(err);
                    return;
                }
                that.app.services[toProvide] = services[toProvide];

                that.app.emit("service", toProvide, services[toProvide]);
            });
            if (!failed) deferred.resolve(that);
        };

        var setup = require(that.packagePath);
        try {
            var r = setup(that, imports, register, that.app);
            if (Q.isPromise(r)) {
                r.then(function(provides) {
                    register(null, provides);
                }, function(err) {
                    register(err);
                });
            }
        } catch(e) {
            deferred.reject(e);
        }

        return deferred.promise;
    };

    // Unload and destroy plugin
    this.destroy = function() {
        if (that.provides.length) {
            // @todo, make it possible if all consuming plugins are also dead
            var err = new Error("Plugins that provide services cannot be destroyed.");
            return that.app.emit("error", err);
        }

        that.emit("destroy");
        that.app.emit("destroy", that);
    };
};
util.inherits(Plugin, events.EventEmitter);



module.exports = Plugin;
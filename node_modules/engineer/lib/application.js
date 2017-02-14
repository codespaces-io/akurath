var events = require('events');
var util = require('util');
var _ = require('underscore');
var Q = require('q');

var Config = require('./config');
var Plugin = require('./plugin');

var Application = function(config, basePlugins) {
    var that = this;
    this.config = new Config(config, this);

    // Map of services resolved
    this.resolved = {
        hub: true
    };

    // Map of plugins
    this.plugins = [];

    // Map of services
    this.services = {
        hub: {
            on: function (name, callback) {
                that.on(name, callback);
            }
        }
    }; 

    // Load some plugins
    this.load = Q.fbind(function(plugins) {
        // Resolve Complete configuration for plugins
        plugins = this.config.resolvePlugins(plugins);

        // Resolve dependencies
        plugins = this.checkCycles(plugins);

        // Transform as plugin
        plugins = _.map(plugins, function(plugin) {
            return new Plugin(plugin, that);
        });

        return _.reduce(plugins, function(d, plugin) {
            return d.then(function() {
                return plugin.load();
            }).then(function() {
                // Add plugin to map
                that.plugins[plugin.packagePath] = plugin;

                // Emit event
                that.emit("plugin", plugin);
            });
        }, Q({})).fail(function(err) {
            // Emit error
            that.emit("error", err);
            return Q.reject(err);
        });
    });

    // Check dependencies
    //      -> check cycle
    //      -> check resolved
    this.checkCycles = function(config) {
        var plugins = _.map(config, function(pluginConfig, index) {
            return {
                packagePath: pluginConfig.packagePath,
                provides: pluginConfig.provides.concat(),
                consumes: pluginConfig.consumes.concat(),
                i: index
            };
        })

        var changed = true;
        var sorted = [];

        while(plugins.length && changed) {
            changed = false;

            plugins.concat().forEach(function(plugin) {
                var consumes = plugin.consumes.concat();

                var resolvedAll = true;
                for (var i=0; i<consumes.length; i++) {
                    var service = consumes[i];
                    if (!that.resolved[service]) {
                        resolvedAll = false;
                    } else {
                        plugin.consumes.splice(plugin.consumes.indexOf(service), 1);
                    }
                }

                if (!resolvedAll)
                    return;

                plugins.splice(plugins.indexOf(plugin), 1);
                plugin.provides.forEach(function(service) {
                    that.resolved[service] = true;
                });
                sorted.push(config[plugin.i]);
                changed = true;
            });
        }

        if (plugins.length) {
            var unresolved = {};
            plugins.forEach(function(plugin) {
                delete plugin.config;
                plugin.consumes.forEach(function(name) {
                    if (unresolved[name] == false)
                        return;
                    if (!unresolved[name])
                        unresolved[name] = [];
                    unresolved[name].push(plugin.packagePath);
                });
                plugin.provides.forEach(function(name) {
                    unresolved[name] = false;
                });
            });

            Object.keys(unresolved).forEach(function(name) {
                if (unresolved[name] == false)
                    delete unresolved[name];
            });

            console.error("Could not resolve dependencies of these plugins:", plugins);
            console.error("Resolved services:", Object.keys(that.resolved));
            console.error("Missing services:", Object.keys(unresolved));
            throw new Error("Could not resolve dependencies: "+ JSON.stringify(Object.keys(that.resolved)));
        }

        return sorted;
    };

    if (basePlugins) this.load(basePlugins);
};
util.inherits(Application, events.EventEmitter);



module.exports = Application;
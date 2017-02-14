var _ = require('underscore');
var fs = require('fs');
var path = require('path');


var Config = function(config, app) {
    var that = this;
    this.app = app;
    this.config = _.defaults({}, config || {}, {
        'paths': process.cwd()
    });

    // Plugins paths:
    if (!_.isArray(this.config.paths)) this.config.paths = [this.config.paths];

    // Check a directory is a valid plugin
    this.checkPackageDirectory = function(pluginDir) {
        var packageJsonFile = path.resolve(pluginDir, 'package.json');
        return fs.existsSync(packageJsonFile);
    };

    // Resolve package path
    this.resolvePackagePath = function(packagePath) {
        var result, base, newPath, maxLevel = 5;

        var returnPath = function() {
            return fs.realpathSync(path.resolve(result, packagePath));
        }

        // Try all config path
        result = _.find(this.config.paths, function(basePath) {
            return this.checkPackageDirectory(path.resolve(basePath, packagePath));
        }, this);
        if (result) return returnPath();

        // Try node_modules
        base = this.config.paths[0];
        while (base && maxLevel) {
            newPath = path.resolve(base, "node_modules", packagePath);
            if (this.checkPackageDirectory(newPath)) {
                result = path.resolve(base, "node_modules");
                return returnPath();
            }
            base = path.resolve(base, '..');
            maxLevel = maxLevel - 1;
        }
        var err = new Error("Can't find '" + packagePath);
        that.app.emit("error", err);
        throw err;
    };

    // Resolve plugins
    this.resolvePlugins = function(plugins) {
        return _.map(plugins, function(plugin) {
            // No config
            if (_.isString(plugin)) {
                plugin = {
                    'packagePath': plugin
                };
            }

            // Check config
            if (!plugin.packagePath) {
                throw new Error("Invalid plugin configuration: need 'packagePath'");
            }

            // Resolve package path
            plugin.packagePath = this.resolvePackagePath(plugin.packagePath);
            

            // Load package infos
            var packageInfos = require(path.resolve(plugin.packagePath, "package.json"));
            plugin = _.extend({
                'provides': [],
                'consumes': []
            }, packageInfos.plugin || {}, plugin);

            return plugin;
        }, this);
    };
};

module.exports = Config;
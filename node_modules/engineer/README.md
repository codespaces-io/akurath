engineer
========

Powerful plugin system for writing large and extensible NodeJS applications. Engineer plugins are compatible with Architect plugins. Using Engineer, you set up a simple configuration and tell Engineer which plugins you want to load. Each plugin registers itself with Engineer, so other plugins can use its functions. Plugins can be maintained as NPM packages so they can be dropped in to other Engineer apps.


### Create an engineer application and load plugins

```javascript
var engineer = require("engineer");

var app = new engineer.Application({
    // Paths could be an array of all plugins locations
    'paths': __dirname
})

app.load([
    // Plugin could be a single string
    './test1',

    // Or plugin could be an object containing options
    {
        packagePath: "./test2",
        port: 8080
    }
]).then(function() {
    console.log("Plugins are loaded!");
});
```

An Application object can emit different object (Inherits from EventEmitter):

```javascript
// Error:
app.on("error", function(err) {
    console.error("Error in the application:");
    console.error(err.stack);
});

// Plugin loaded
app.on("plugin", function(plugin) {}):

// Service ready
app.on("service", function(name, service) {}):
```


### Plugin interface

```javascript
// auth.js

/* All plugins must export this public signature.
 * @plugin is the hash of options the user passes in when creating an instance
 * of the plugin.
 * @imports is a hash of all services this plugin consumes.
 * @register is the callback to be called when the plugin is done initializing.
 */
module.exports = function setup(plugin, imports, register) {

  // "database" was a service this plugin consumes
  var db = imports.database;

  register(null, {
    // "auth" is a service this plugin provides
    auth: {
      users: function (callback) {
        db.keys(callback);
      },
      authenticate: function (username, password, callback) {
        db.get(username, function (user) {
          if (!(user && user.password === password)) {
            return callback();
          }
          callback(user);
        });
      }
    }
  });
};
```

Each plugin is a node module complete with a package.json file. It need not actually be in npm, it can be a simple folder in the code tree.

```
{
    "name": "auth",
    "version": "0.0.1",
    "main": "auth.js",
    "private": true,
    "plugin": {
        "consumes": ["database"],
        "provides": ["auth"]
    }
}
```
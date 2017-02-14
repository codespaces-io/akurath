#!/usr/bin/env node

var Q = require('q');
var _ = require('lodash');
var cli = require('commander');
var path = require('path');
var open = require("open");
var Gittle = require('gittle');

var pkg = require('../package.json');
var akurath = require("../index.js");

// Akurath git repo: use to identify the user
var akurathGitRepo = new Gittle(path.resolve(__dirname, ".."));

// Options
cli.option('-p, --port [http port]', 'Port to run the IDE');
cli.option('-n, --hostname [http hostname]', 'Hostname to run the IDE');
cli.option('-t, --title [project title]', 'Title for the project.');
cli.option('-s, --sample [project type]', 'Replace directory content by a sample (warning: erase content).');
cli.option('-o, --open', 'Open the IDE in your favorite browser');
cli.option('-e, --email [email address]', 'Email address to use as a default authentication');
cli.option('-u, --users [list users]', 'List of coma seperated users and password (formatted as "username:password")');


// An authentication hook that uses a dictionary of users
function usersAuthHook(users) {
    return function(data) {
        if (!data.email || !data.token) {
            return Q.reject(new Error("Need 'token' and 'email' for auth hook"));
        }

        var userId = data.email;

        if (!users[userId] || data.token != users[userId]) {
            return Q.reject(new Error("Invalid user !"));
        }

        return {
            'userId': userId,
            'name': userId,
            'token': data.token,
            'email': data.email
        };
    };
}

// Command 'run'
cli.command('run [folder]')
.description('Run a Akurath into a specific folder.')
.action(function(projectDirectory) {
    var that = this;
    var prepare = Q();

    // Akurath.io settings
    that.box = process.env.CODEBOXIO_BOXID;
    that.key = process.env.CODEBOXIO_TOKEN;
    that.akurathio = process.env.CODEBOXIO_HOST || "https://api.akurath.io";

    // Default options
    that.directory = projectDirectory || process.env.WORKSPACE_DIR || "./";
    that.title = that.title || process.env.WORKSPACE_NAME;
    that.port = that.port || process.env.PORT || 8000;
    that.hostname = that.hostname || "0.0.0.0";

    var users = !that.users ? {} : _.object(_.map(that.users.split(','), function(x) {
        // x === 'username:password'
        return x.split(':', 2);
    }));


    var config = {
        'root': that.directory,
        'title': that.title,
        'server': {
            'port': parseInt(that.port),
            'hostname': that.hostname
        },
        'users': {
            'defaultEmail': that.email
        },
        'project': {
            'forceSample': that.sample
        }
    };

    // Use Akurath.io
    if (that.box && that.akurathio && that.key) {
        _.extend(config, {
            'workspace': {
                'id': that.box
            },
            'hooks': {
                'auth': that.akurathio+"/api/box/"+that.box+"/auth",
                'events': that.akurathio+"/api/box/"+that.box+"/events",
                'settings': that.akurathio+"/api/account/settings",
                'addons': that.akurathio+"/api/addons/valid"
            },
            'webhook': {
                'authToken': that.key
            },
            'proc': {
                'urlPattern': 'http://web-%d.' + that.box + '.vm1.dynobox.io'
            },
            'users': {
                // Don't use default git user
                'gitDefault': false
            }
        });
    } else if(!_.isEmpty(users)) {
        _.extend(config, {
            'public': false,
            'hooks': {
                'auth': usersAuthHook(users)
            }
        });
    }

    // Auth user using git
    prepare.fin(function() {
        // Start Akurath
        return akurath.start(config).then(function() {
            var url = "http://localhost:"+that.port;

            console.log("\nAkurath is running at",url);

            if (that.open) {
                open(url);
            }
        }, function(err) {
            console.error('Error initializing CodeBox');
            console.error(err);
            console.error(err.stack);

            // Kill process
            process.exit(1);
        });
    })
});

cli.on('--help', function(){
    console.log('  Version: %s', pkg.version);
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ akurath run');
    console.log('    $ akurath run ./myProject');
    console.log('');
    console.log('    Use option --open to directly open the IDE in your browser:');
    console.log('    $ akurath run ./myProject --open');
    console.log('');
});

cli.version(pkg.version).parse(process.argv);
if (!cli.args.length) cli.help();

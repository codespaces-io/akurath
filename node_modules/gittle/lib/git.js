var Git, exec, fs, options_to_argv, Q, pty, _, errors;

_ = require('lodash');
fs = require('fs');
pty = require('pty.js');
Q = require('q');
exec = require('child_process').exec;
errors = require('./errors');

module.exports = Git = function(git_dir, dot_git) {
    var git, execGit;
    dot_git || (dot_git = "" + git_dir + "/.git");
    execGit = function(useTerminal, command, options, args, creds) {
        var bash, d, err, stdout, termArgs, errCode = errors.codes.UNKNOWN;

        d = Q.defer();
        if (options == null) {
            options = {};
        }
        options = options_to_argv(options);
        options = options.join(" ");
        if (args == null) {
            args = [];
        }
        if (args instanceof Array) {
            args = args.join(" ");
        }
        bash = "" + Git.bin + " " + command + " " + options + " " + args;
        termArgs =  _.compact((command + " " + options + " " + args).split(" ")).join(" ").split(" ");

        d.notify(bash);
        if (useTerminal) {
            var pterm = pty.spawn(Git.bin, termArgs, {
                cwd: git_dir
            });
            creds = creds || {};
            stdout = "";
            pterm.on('data', function(data) {
                stdout = stdout + data;
                var prompt = data.toLowerCase();

                // SSH host
                if (prompt.indexOf('yes/no') > -1) {
                    // By default gittle accept all ssh host
                    if (creds.refuseUnknownHost) {
                        pterm.write('no\r');
                    } else {
                        pterm.write('yes\r');
                    }

                // Username
                } else if (prompt.indexOf('username') > -1) {
                    pterm.write(creds.username + '\r');

                // Password
                } else if (prompt.indexOf('password') > -1) {
                    pterm.write(creds.password + '\r');

                // SSH passphrase
                } else if (prompt.indexOf('passphrase') > -1) {
                    pterm.write(creds.passphrase + '\r');

                // Errors
                } else if ((prompt.indexOf('error') > -1)
                || (prompt.indexOf('fatal') > -1)
                || prompt.indexOf("permission denied") > -1) {
                    if ((prompt.indexOf("authentication") > -1)
                    || prompt.indexOf("permission denied") > -1) {
                        errCode = errors.codes.AUTH;
                    }

                    err = errors.error(
                        errCode,
                        _.compact(prompt.split('\r\n')).join(" ")
                    );
                }
            });
            pterm.on('exit', function() {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve({
                        'stdout': stdout,
                        'bash': bash
                    });
                }
            });
        } else {
            var pterm = exec(bash, {
                cwd: git_dir
            }, function(err, stdout, stderr) {
                if (err) return d.reject(errors.error(errors.codes.UNKNOWN, err));
                d.resolve({
                    'stdout': stdout,
                    'stderr': stderr,
                    'bash': bash
                })
            });
        }

        return d.promise;
    };

    git = _.partial(execGit, false);
    git.term = _.partial(execGit, true);

    git.list_remotes = function() {
        return Q.nfapply(fs.readdir, ["" + dot_git + "/refs/remotes"]).then(function(files) {
            return fiels || [];
        });
    };
    git.refs = function(type, options) {
        var prefix, _ref;
        prefix = "refs/" + type + "s/";
        return git("show-ref").then(function(out) {
            var text = out.stdout;
            var id, line, matches, name, _i, _len, _ref1, _ref2;
            matches = [];
            _ref1 = (text || "").split("\n");
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                line = _ref1[_i];
                if (!line) {
                    continue;
                }
                _ref2 = line.split(' '), id = _ref2[0], name = _ref2[1];
                if (name.substr(0, prefix.length) === prefix) {
                    matches.push("" + (name.substr(prefix.length)) + " " + id);
                }
            }
            return matches.join("\n");
        });
    };
    return git;
};

Git.bin = "git";

Git.options_to_argv = options_to_argv = function(options) {
    var argv, key, val;
    argv = [];
    for (key in options) {
        val = options[key];
        if (key.length === 1) {
            if (val === true) {
                argv.push("-" + key);
            } else if (val === false) {

            } else {
                argv.push("-" + key);
                argv.push(val);
            }
        } else {
            if (val === true) {
                argv.push("--" + key);
            } else if (val === false) {

            } else {
                argv.push("--" + key + "=" + val);
            }
        }
    }
    return argv;
};

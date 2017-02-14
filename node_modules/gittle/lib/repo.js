
var Actor, Commit, Diff, Head, Ref, Repo, Status, Tag, Tree, cmd, _, _ref, Q, errors;

Q = require('q');
_ = require('lodash');
cmd = require('./git');
Actor = require('./actor');
Commit = require('./commit');
Tree = require('./tree');
Diff = require('./diff');
Tag = require('./tag');
Status = require('./status');
errors = require('./errors');
_ref = require('./ref'), Ref = _ref.Ref, Head = _ref.Head;

module.exports = Repo = (function() {
    function Repo(path, bare) {
        this.path = path;
        this.bare = bare;
        if (this.bare) {
            this.dot_git = this.path;
        } else {
            this.dot_git = "" + this.path + "/.git";
        }
        this.git = cmd(this.path, this.dot_git);
    }

    Repo.prototype.identity = function() {
        var that = this;
        var email, name;

        return this.git("config", {}, ["user.email"]).then(function(out) {
            if (out.stdout == null) {
                out.stdout = '';
            }
            email = out.stdout != null ? out.stdout.trim() : void 0;
            return that.git("config", {}, ["user.name"])
        }).then(function(out) {
            if (out.stdout == null) {
                out.stdout = '';
            }
            name = out.stdout != null ? out.stdout.trim() : void 0;
            return new Actor(name, email);
        });
    };

    Repo.prototype.identify = function(actor) {
        var that = this;
        return this.git("config", {}, ["user.email", "\"" + actor.email + "\""]).then(function() {
            return that.git("config", {}, ["user.name", "\"" + actor.name + "\""]);
        });
    };

    Repo.prototype.commits = function(start, limit, skip) {
        if (start == null) {
            start = "master";
        }
        if (limit == null) {
            limit = 10;
        }
        if (skip == null) {
            skip = 0;
        }
        return Commit.find_all(this, start, {
            "max-count": limit,
            skip: skip
        });
    };

    Repo.prototype.tree = function(treeish) {
        if (treeish == null) {
            treeish = "master";
        }
        return new Tree(this, treeish);
    };

    Repo.prototype.diff = function(commitA, commitB, paths) {
        var that = this;
        if (paths == null) {
            paths = [];
        }
        if (_.isObject(commitA)) {
            commitA = commitA.id;
        }
        if (_.isObject(commitB)) {
            commitB = commitB.id;
        }
        return this.git("diff", {}, _.flatten([commitA, commitB, "--", paths])).then(function(out) {
            return Diff.parse(that, out.stdout);
        });
    };

    Repo.prototype.remotes = function() {
        return Ref.find_all(this, "remote", Ref);
    };

    Repo.prototype.remote_list = function() {
        return this.git.list_remotes();
    };

    Repo.prototype.remote_add = function(name, url) {
        return this.git("remote", {}, ["add", name, url]);
    };

    Repo.prototype.remote_remove = function(name) {
        return this.git("remote", {}, ["rm", name]);
    };

    Repo.prototype.merge = function(name) {
        return this.git("merge", {}, name);
    };

    Repo.prototype.status = function() {
        return Status(this);
    };

    Repo.prototype.tags = function() {
        return Tag.find_all(this);
    };

    Repo.prototype.create_tag = function(name, options) {
        return this.git("tag", options, [name]);
    };

    Repo.prototype.delete_tag = function(name) {
        return this.git("tag", {
            d: name
        });
    };

    Repo.prototype.branches = function() {
        return Head.find_all(this);
    };

    Repo.prototype.create_branch = function(name) {
        return this.git("branch", {}, name);
    };

    Repo.prototype.delete_branch = function(name) {
        return this.git("branch", {
            d: true
        }, name);
    };

    Repo.prototype.branch = function(name) {
        if (!name) {
            return Head.current(this);
        } else {
            return this.branches().then(function(heads) {
                var head, _i, _len;
                for (_i = 0, _len = heads.length; _i < _len; _i++) {
                    head = heads[_i];
                    if (head.name === name) {
                        return  head;
                    }
                }
                return Q.reject(errors.error(errors.codes.NOTFOUND, "No branch named '" + name + "' found"));
            });
        }
    };

    Repo.prototype.checkout = function(treeish) {
        return this.git("checkout", {}, treeish);
    };

    Repo.prototype.commit = function(message, options) {
        if (options == null) {
            options = {};
        }
        options = _.extend(options, {
            m: "'" + message + "'"
        });
        return this.git("commit", options);
    };

    Repo.prototype.add = function(files) {
        if (_.isString(files)) {
            files = [files];
        }
        return this.git("add", {}, files);
    };

    Repo.prototype.remove = function(files) {
        if (_.isString(files)) {
            files = [files];
        }
        return this.git("rm", {}, files);
    };

    Repo.prototype.revert = function(sha) {
        return this.git("revert", {}, sha);
    };

    Repo.prototype.sync = function(remote_name, branch_name, creds) {
        var branch, remote, status, that = this;

        remote = remote_name;
        branch = branch_name;

        if (!branch) {
            branch = remote_name;
            remote = "origin";
        }

        branch = branch || "master";
        return this.status().then(function(stat) {
            status = stat;
            return that.git("stash", {}, ["save"]);
        }).then(function(out) {
            return that.pull(remote, branch, creds);
        }).then(function(out) {
            return that.push(remote, branch, creds);
        }).then(function() {
            if (!(status != null ? status.clean : void 0)) {
                return that.git("stash", {}, ["pop"]);
            } else {
                return Q();
            }
        });
    };

    Repo.prototype.pull = function(remote, branch, creds) {
        remote = remote || "origin";
        branch = branch || "master";
        return this.git.term("pull", {}, [remote, branch], creds);
    };

    Repo.prototype.fetch = function(remote, creds) {
        remote = remote || "origin";
        return this.git.term("fetch", {}, [remote], creds);
    };

    Repo.prototype.push = function(remote, branch, creds) {
        remote = remote || "origin";
        branch = branch || "master";
        return this.git.term("push", {}, [remote, branch], creds);
    };

    Repo.prototype.track = function(files) {
        return this.git('add', {
            'N': true
        }, files).then(Q());
    };

    Repo.prototype.untrack = function(files) {
        return this.git('rm', {
            'r': true,
            'cached': true,
        }, files).then(Q());
    };

    Repo.prototype.untracked_files = function() {
        return this.status()
        .then(function(status) {
            return _.filter(_.keys(status.files), function(name) {
                return status.files[name].tracked === false;
            });
        }).then(Q());
    };

    Repo.prototype.stage_files = function(files) {
        return this.git('add', {
            // -A option
            'A': true
        }, files).then(Q(files));
    };

    // Diff of the current working directory
    // This pushes things to the index, we could avoid that maybe
    Repo.prototype.diff_working = function() {
        var that = this;
        return this.untracked_files()
        .then(function(files) {

            var _diff;
            var setDiff = function(d) {
                _diff = d;
            };
            var getDiff = function() {
                return _diff;
            };

            var diff = _.partial(that.diff, null, null);
            var track = _.partial(that.track, files);
            var untrack = _.partial(that.untrack, files);

            if(_.isEmpty(files)) {
                return diff();
            }

            return track()
            .then(diff)
            .then(setDiff)
            .then(untrack)
            .then(getDiff);
        });
    };

    Repo.prototype.current_branch = function() {
        return this.branch().get('name');
    };

    Repo.prototype.commits_pending = function() {
        var that = this;
        return this.current_branch().then(function(branch) {
            return that.commits('origin/'+branch+'..');
        });
    };

    Repo.prototype.commitWith = function(name, email, msg, files) {
        var that = this;
        files = files || [];

        var newIdentity = {
            name: name,
            email: email
        };

        var _author;
        var setAuthor = function(a) {
            _author = a;
        };
        var getAuthor = function() {
            return _author;
        };

        return that.identity()
        .then(function(author) {
            return setAuthor(author);
        }, function() {
            // Identity may fail depending on "git config"
            return setAuthor(newIdentity);
        })
        .then(function() {
            // Set newIdentity from args
            return that.identify(newIdentity);
        })
        .then(function() {
            // Stage files
            return that.stage_files(files);
        })
        .then(function() {
            // Do commit with new identity
            return that.commit(msg);
        })
        .then(function() {
            // Restore previous identity
            return that.identify(getAuthor());
        });
    };

    return Repo;

})();

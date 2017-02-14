var Q, Commit, Head, Ref, fs, _ref, errors,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Q = require('q');
fs = require('fs');
Commit = require('./commit');
errors = require('./errors');

exports.Ref = Ref = (function() {
    function Ref(name, commit) {
        this.name = name;
        this.commit = commit;
        this.repo = this.commit.repo;
    }

    Ref.prototype.toString = function() {
        return "#<Ref '" + this.name + "'>";
    };

    Ref.find_all = function(repo, type, RefClass) {
        var id, ids, name, names, ref, _i, _len, _ref, _ref1;
        return repo.git.refs(type, {}).then(function(text) {
            names = [];
            ids = [];
            _ref = text.split("\n");
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                ref = _ref[_i];
                if (!ref) {
                    continue;
                }
                _ref1 = ref.split(' '), name = _ref1[0], id = _ref1[1];
                names.push(name);
                ids.push(id);
            }
            return Commit.find_commits(repo, ids);
        }).then(function(commits) {
            var i, refs, _j, _len1;
            refs = [];
            for (i = _j = 0, _len1 = names.length; _j < _len1; i = ++_j) {
                name = names[i];
                refs.push(new RefClass(name, commits[i]));
            }
            return refs;
        });
    };

    return Ref;

})();

exports.Head = Head = (function(_super) {
    __extends(Head, _super);

    function Head() {
        _ref = Head.__super__.constructor.apply(this, arguments);
        return _ref;
    }

    Head.find_all = function(repo) {
        return Ref.find_all(repo, "head", Head);
    };

    Head.current = function(repo) {
        var branch, m, _ref1;

        return Q.nfapply(fs.readFile, ["" + repo.dot_git + "/HEAD"]).then(function(data) {
            _ref1 = /ref: refs\/heads\/([^\s]+)/.exec(data);
            if (!_ref1) throw errors.error(errors.codes.INVALID, "Head is not a branch, head="+data);

            m = _ref1[0], branch = _ref1[1];

            return Q.nfapply(fs.readFile, ["" + repo.dot_git + "/refs/heads/" + branch])
        }).then(function(id) {
            return Commit.find(repo, id);
        }).then(function(commit) {
            return new Head(branch, commit)
        });
    };

    return Head;

})(Ref);

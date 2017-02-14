var Actor, Commit, Tree, _, Q;

_ = require('lodash');
Q = require('q');
Actor = require('./actor');
Tree = require('./tree');

module.exports = Commit = (function() {
    function Commit(repo, id, parents, tree, author, authored_date, committer, committed_date, message) {
        var _this = this;
        this.repo = repo;
        this.id = id;
        this.author = author;
        this.authored_date = authored_date;
        this.committer = committer;
        this.committed_date = committed_date;
        this.message = message;
        this.tree = _.memoize(function() {
            return new Tree(_this, tree);
        });
        this.parents = _.memoize(function() {
            return _.map(parents, function(parent) {
                return new Commit(_this.repo, parent);
            });
        });
    }

    Commit.prototype.toJSON = function() {
        return {
            id: this.id,
            author: this.author,
            authored_date: this.authored_date,
            committer: this.committer,
            committed_date: this.committed_date,
            message: this.message
        };
    };

    Commit.find_all = function(repo, ref, options) {
        var that = this;
        options = _.extend({
            pretty: "raw"
        }, options);
        return repo.git("rev-list", options, ref).then(function(out) {
            return that.parse_commits(repo, out.stdout);
        });
    };

    Commit.find = function(repo, id) {
        var options,
            that = this;
        options = {
            pretty: "raw",
            "max-count": 1
        };
        return repo.git("rev-list", options, id).then(function(out) {
            return that.parse_commits(repo, out.stdout)[0];
        });
    };

    Commit.find_commits = function(repo, ids) {
        var commits, next;
        commits = [];
        next = function(i) {
            var id;
            if (id = ids[i]) {
                return Commit.find(repo, id).then(function(commit) {
                    commits.push(commit);
                    return next(i + 1);
                });
            } else {
                return commits;
            }
        };
        return next(0);
    };

    Commit.parse_commits = function(repo, text) {
        var author, author_line, authored_date, commits, committed_date, committer, committer_line, encoding, id, lines, message_lines, parents, tree, _ref, _ref1;
        commits = [];
        lines = text.split("\n");
        while (lines.length) {
            id = _.last(lines.shift().split(" "));
            if (!id) {
                break;
            }
            tree = _.last(lines.shift().split(" "));
            parents = [];
            while (/^parent/.test(lines[0])) {
                parents.push(_.last(lines.shift().split(" ")));
            }
            author_line = lines.shift();
            if (!/^committer /.test(lines[0])) {
                author_line.push(lines.shift());
            }
            _ref = this.actor(author_line), author = _ref[0], authored_date = _ref[1];
            committer_line = lines.shift();
            if (lines[0] && !/^encoding/.test(lines[0])) {
                committer_line.push(lines.shift());
            }
            _ref1 = this.actor(committer_line), committer = _ref1[0], committed_date = _ref1[1];
            if (/^encoding/.test(lines.first)) {
                encoding = _.last(lines.shift().split(" "));
            }
            lines.shift();
            message_lines = [];
            while (/^ {4}/.test(lines[0])) {
                message_lines.push(lines.shift().slice(4));
            }
            while ((lines[0] != null) && !lines[0].length) {
                lines.shift();
            }
            commits.push(new Commit(repo, id, parents, tree, author, authored_date, committer, committed_date, message_lines.join("\n")));
        }
        return commits;
    };

    Commit.actor = function(line) {
        var actor, epoch, m, _ref;
        _ref = /^.+? (.*) (\d+) .*$/.exec(line), m = _ref[0], actor = _ref[1], epoch = _ref[2];
        return [Actor.from_string(actor), new Date(1000 * +epoch)];
    };

    return Commit;
})();
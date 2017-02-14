var Gittle, Repo, Git, exec, Q, errors;

Q = require('q');
exec = require('child_process').exec;
Repo = require('./repo');
Git = require("./git");
errors = require("./errors");

module.exports = Gittle = function(path, bare) {
    if (bare == null) {
        bare = false;
    }
    return new Repo(path, bare);
};

Gittle.errors = errors.code;

Gittle.init = function(path) {
    var cmd = Git();
    return cmd("init", {}, [path])
    .then(function() {
        return new Repo(path)
    });
};

Gittle.setBin = function(bin) {
    Git.bin = bin;
    return Gittle;
};

Gittle.clone = function(repository, path, creds) {
    var cmd = Git();
    return cmd.term("clone", {}, [repository, path], creds)
    .then(function() {
        return new Repo(path)
    });
};

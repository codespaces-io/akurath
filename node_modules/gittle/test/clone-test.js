var Gittle = require("../");
var Q = require("q");
var tmp = require("tmp");
var qtest = require("./test").qtest;

tmp.setGracefulCleanup();

exports.clones = {
    // Clone https public repo
    httpsPublic: function(test) {
        qtest(
            Q.nfcall(tmp.dir)
            .then(function(path) {
                return Gittle.clone("https://SamyPesse@github.com/CodeboxIDE/gittle.js.git", path);
            }),
            test
        );
    }
}
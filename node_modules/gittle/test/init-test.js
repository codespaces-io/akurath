var Gittle = require("../");
var Q = require("q");
var tmp = require("tmp");
var qtest = require("./test").qtest;

tmp.setGracefulCleanup();

exports.init = {
    // Init an empty repo
    emptyRepo: function(test) {
        qtest(
            Q.nfcall(tmp.dir)
            .then(function(path) {
                return Gittle.init(path);
            }),
            test
        );
    }
}
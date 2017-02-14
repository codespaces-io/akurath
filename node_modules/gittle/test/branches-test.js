var repo = require("./repo");
var qtest = require("./test").qtest;

exports.branches = {
    // Branches listing
    list: function(test) {
        qtest(repo.branches(), test);
    },

    // Current branch
    current: function(test) {
        qtest(repo.branch(), test);
    }
}
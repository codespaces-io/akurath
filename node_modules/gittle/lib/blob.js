var Blob, path, Q;

path = require('path');
Q = require('q');

module.exports = Blob = (function() {
    function Blob(repo, attrs) {
        this.repo = repo;
        this.id = attrs.id, this.name = attrs.name, this.mode = attrs.mode;
    }

    Blob.prototype.data = function() {
        return this.repo.git("cat-file", {
            p: true
        }, this.id).then(function(out) {
            return out.stdout;
        });
    };

    Blob.prototype.toString = function() {
        return "#<Blob '" + this.id + "'>";
    };

    return Blob;
})();

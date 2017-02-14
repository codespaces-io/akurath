var Submodule;

module.exports = Submodule = (function() {
    function Submodule(repo, options) {
        this.repo = repo;
        this.id = options.id, this.name = options.name, this.mode = options.mode;
    }

    Submodule.prototype.url = function(treeish) {
        var that = this;
        if (treeish == null) {
            treeish = "master";
        }
        return Submodule.config(this.repo, treeish).then(function(config) {
            return config != null ? config[that.name].url : void 0;
        });
    };

    Submodule.config = function(repo, treeish) {
        return repo.tree(treeish).find(".gitmodules").then(function(blob) {
            return blob.data();
        }).then(function(data) {
            var conf, current, line, lines, match;
            conf = {};
            lines = data.split("\n");
            current = null;
            while (lines.length) {
                line = lines.shift();
                if (match = /^\[submodule "(.+)"\]$/.exec(line)) {
                    current = match[1];
                    conf[current] = {};
                } else if (match = /^\s+([^\s]+)\s+[=]\s+(.+)$/.exec(line)) {
                    conf[current][match[1]] = match[2];
                }
            }
            return conf;
        });
    };

    return Submodule;
})();

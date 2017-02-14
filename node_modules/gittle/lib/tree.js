var Blob, Submodule, Tree, _, Q, errors;

Q = require('q');
_ = require('lodash');
Blob = require('./blob');
Submodule = require('./submodule');
errors = require('./errors');

module.exports = Tree = (function() {
	function Tree(repo, options) {
		this.repo = repo;
		if (_.isString(options)) {
			this.id = options;
		} else {
			this.id = options.id, this.name = options.name, this.mode = options.mode;
		}
	}

	Tree.prototype.contents = function() {
		var _this = this;
		if (this._contents) {
			return Q(this._contents);
		}
		return this.repo.git("ls-tree", {}, this.id).then(function(out) {
			var line, _i, _len, _ref;
			_this._contents = [];
			_ref = out.stdout.split("\n");
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				line = _ref[_i];
				if (line) {
					_this._contents.push(_this.content_from_string(line));
				}
			}
			return _this._contents;
		});
	};

	Tree.prototype.blobs = function() {
		return this.contents().then(function(children) {
			return _.filter(children, function(child) {
				return child instanceof Blob;
			});
		});
	};

	Tree.prototype.trees = function() {
		return this.contents().then(function(children) {
			return _.filter(children, function(child) {
				return child instanceof Tree;
			});
		});
	};

	Tree.prototype.find = function(file) {
		var dir, rest, _ref,
			_this = this;
		if (/\//.test(file)) {
			_ref = file.split("/", 2), dir = _ref[0], rest = _ref[1];
			return this.trees().then(function( _trees) {
				var tree, _i, _len;
				for (_i = 0, _len = _trees.length; _i < _len; _i++) {
					tree = _trees[_i];
					if (tree.name === dir) {
						return Q.reject(rest);
					}
				}
				return null;
			});
		} else {
			return this.contents().then(function(children) {
				var child, _i, _len;
				for (_i = 0, _len = children.length; _i < _len; _i++) {
					child = children[_i];
					if (child.name === file) {
						return child;
					}
				}
				return null;
			});
		}
	};

	Tree.prototype.content_from_string = function(line) {
		var id, mode, name, type, _ref;
		_ref = line.split(/[\t ]+/, 4), mode = _ref[0], type = _ref[1], id = _ref[2], name = _ref[3];
		switch (type) {
			case "tree":
				return new Tree(this.repo, {
					id: id,
					name: name,
					mode: mode
				});
			case "blob":
				return new Blob(this.repo, {
					id: id,
					name: name,
					mode: mode
				});
			case "link":
				return new Blob(this.repo, {
					id: id,
					name: name,
					mode: mode
				});
			case "commit":
				return new Submodule(this.repo, {
					id: id,
					name: name,
					mode: mode
				});
			default:
				throw errors.error(errors.codes.INVALID, "Invalid object type: '" + type + "'");
		}
	};

	Tree.prototype.toString = function() {
		return "#<Tree '" + this.id + "'>";
	};

	return Tree;
})();
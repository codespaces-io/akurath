(function() {
  var Tags, es;

  Tags = require('bindings')('ctags.node').Tags;

  es = require('event-stream');

  exports.findTags = function(tagsFilePath, tag, options, callback) {
    var caseInsensitive, partialMatch, tagsWrapper, _ref;
    if (typeof tagsFilePath !== 'string') {
      throw new TypeError('tagsFilePath must be a string');
    }
    if (typeof tag !== 'string') {
      throw new TypeError('tag must be a string');
    }
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    _ref = options != null ? options : {}, partialMatch = _ref.partialMatch, caseInsensitive = _ref.caseInsensitive;
    tagsWrapper = new Tags(tagsFilePath);
    tagsWrapper.findTags(tag, partialMatch, caseInsensitive, function(error, tags) {
      tagsWrapper.end();
      return typeof callback === "function" ? callback(error, tags) : void 0;
    });
    return void 0;
  };

  exports.createReadStream = function(tagsFilePath, options) {
    var chunkSize, tagsWrapper;
    if (options == null) {
      options = {};
    }
    if (typeof tagsFilePath !== 'string') {
      throw new TypeError('tagsFilePath must be a string');
    }
    chunkSize = options.chunkSize;
    if (typeof chunkSize !== 'number') {
      chunkSize = 100;
    }
    tagsWrapper = new Tags(tagsFilePath);
    return es.readable(function(count, callback) {
      if (!tagsWrapper.exists()) {
        return callback(new Error("Tags file could not be opened: " + tagsFilePath));
      }
      return tagsWrapper.getTags(chunkSize, (function(_this) {
        return function(error, tags) {
          if ((error != null) || tags.length === 0) {
            tagsWrapper.end();
          }
          callback(error, tags);
          if ((error != null) || tags.length === 0) {
            return _this.emit('end');
          }
        };
      })(this));
    });
  };

}).call(this);

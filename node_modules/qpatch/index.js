// Requires
var Q = require('q');
var _ = require('underscore');
var inherits = require('util').inherits;


function qClass(cls, methodExceptions) {
    // Methods not to patch
    methodExceptions = methodExceptions || [];

    var newCls = function newCls() {
        newCls.super_.apply(this, arguments);
    };
    inherits(newCls, cls);

    // Set name
    newCls.name = cls.name;

    _.methods(cls.prototype).forEach(function(method) {
        // Don't change internal functions
        var f;
        if(method[0] === '_' || _.contains(methodExceptions, method)) {
            f = cls.prototype[method];
        } else {
            f = qMethod(cls.prototype[method]);
        }
        // Set function
        newCls.prototype[method] =f;
    });

    return newCls;
}

function qMethod(method) {
    var f = function() {
        var d = Q.defer();
        var args = _.toArray(arguments);

        // Add callback
        args.push(function(err, value) {
            if(err) return d.reject(err);
            return d.resolve(value);
        });

        // Call function
        method.apply(this, args);

        // Return promise
        return d.promise;
    };
    f.name = method.name;
    return f;
}


// Exports
exports.qClass = qClass;
exports.qMethod = qMethod;

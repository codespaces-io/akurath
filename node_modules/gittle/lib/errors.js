

module.exports = {
    error: function(code, message) {
        var e = new Error(message);
        e.code = code;

        return e;
    },
    codes: {
        INVALID: 400,
        AUTH: 401,
        NOTFOUND: 404,
        UNKNOWN: 500,
    }
}
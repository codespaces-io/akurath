var http = require('http');
var qs = require('querystring');
var shux = require('../../')();
var peer = require('secure-peer')(require('./keys/server.json'));
var authorized = [ require('./keys/client.json').public ];

var server = http.createServer(function (req, res) {
    var params = qs.parse(req.url.split('?')[1]);
    var sec = peer(function (stream) {
        var id = req.url.split('/')[1].split('?')[0];
        var sh = shux.shells[id]
            ? shux.attach(id, params)
            : shux.createShell(id, params);
        ;
        sh.pipe(stream).pipe(sh);
        sh.on('end', stream.end.bind(stream));
    });
    sec.on('identify', function (id) {
        var ix = authorized.indexOf(id.key.public);
        id[ ix < 0 ? 'reject' : 'accept' ]();
    });
    req.pipe(sec).pipe(res);
});
server.listen(5000);

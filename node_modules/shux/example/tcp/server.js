var net = require('net');
var shux = require('../../')();
shux.createShell('xyz');

var server = net.createServer(function (stream) {
    var sh = shux.attach('xyz');
    stream.pipe(sh).pipe(stream);
});
server.listen(5000);

var net = require('net');
var through = require('through');

var state = { meta: false };
var keyboard = through(function (buf) {
    if (buf.length === 1 && buf[0] === 1) return state.meta = true;
    
    if (state.meta && buf[0] === 'd'.charCodeAt(0)) {
        process.exit();
    }
    else this.queue(buf);
    state.meta = false;
});

var c = net.connect(5000);
keyboard.pipe(c).pipe(process.stdout);

process.stdin.setRawMode(true);
process.stdin.pipe(keyboard);

process.on('exit', function () {
    process.stdin.setRawMode(false);
    console.log();
});

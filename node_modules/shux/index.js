var pty = require('pty.js');
var through = require('through');
var duplexer = require('duplexer');
var Terminal = require('headless-terminal');
var render = require('./lib/render');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = function () {
    return new Shux();
};

function Shux () {
    this.shells = {};
}

inherits(Shux, EventEmitter);

Shux.prototype.list = function () {
    return Object.keys(this.shells);
};

Shux.prototype.attach = function (id, opts) {
    if (!opts) opts = {};
    var sh = this.shells[id];
    if (!sh) return;
    
    if (opts.columns && opts.rows) {
        sh.ps.resize(Number(opts.columns), Number(opts.rows));
    }
    
    var stdin = through();
    var stdout = through();
    
    stdin.pipe(sh.ps, { end: false });
    sh.ps.pipe(stdout);
    
    process.nextTick(function () {
        var x = sh.terminal.x + 1;
        var y = sh.terminal.y + 1;
        stdout.write(Buffer.concat([
            Buffer([ 0x1b, 0x63 ]),
            render(sh.terminal.displayBuffer),
            Buffer([ 0x1b, 0x5b ]),
            Buffer(y + ';' + x + 'f')
        ]));
    });
    
    var dup = duplexer(stdin, stdout);
    sh.ps.on('end', dup.emit.bind(dup, 'end'));
    dup.id = id;
    
    this.emit('attach', id);
    stdin.on('end', this.emit.bind(this, 'detach', id));
    return dup;
};

Shux.prototype.destroy = function (id, sig) {
    var sh = this.shells[id];
    if (!sh) return false;
    sh.ps.kill(sig === undefined ? 'SIGKILL' : sig);
    return true;
};

Shux.prototype.createShell = function (id, opts) {
    var self = this;
    if (typeof id === 'object') { opts = id; id = undefined }
    if (!opts) opts = {};
    id = id || opts.id || Math.floor(Math.pow(16,4)*Math.random()).toString(16);
    
    if (opts.columns) opts.columns = Number(opts.columns);
    if (opts.rows) opts.rows = Number(opts.rows);
    
    var cmd = opts.command || 'bash';
    var args = opts.arguments || [];
    if (Array.isArray(cmd)) {
        args = cmd.slice(1);
        cmd = cmd[0];
    }

    // Pty options
    var ptyOpts = {};  // Default values

    var unWantedOpts = ['command', 'arguments', 'id'];
    Object.keys(opts).filter(function(key) {
        // Filter out unwanted keys for pty.js
        return unWantedOpts.indexOf(key) == -1;
    }).forEach(function(key) {
        // Add to ptyOpts
        ptyOpts[key] = opts[key];
    });

    var ps = pty.spawn(cmd, args, ptyOpts);
    ps.on('exit', function () {
        delete self.shells[id];
        self.emit('exit', id);
        ps.emit('end');
    });
    
    var term = new Terminal(opts.columns, opts.rows);
    term.open();
    ps.on('data', function (buf) { term.write(buf) });
    
    this.shells[id] = { ps: ps, terminal: term };
    this.emit('spawn', id);
    return this.attach(id);
};

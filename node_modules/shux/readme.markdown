# shux

streaming shell multiplexer

[![build status](https://secure.travis-ci.org/substack/shux.png)](http://travis-ci.org/substack/shux)

like screen or tmux but as pure javascript library instead of a program

# example

## re-attachable single-session tcp shell server

server.js:

``` js
var net = require('net');
var shux = require('shux')();
shux.createShell('xyz');

var server = net.createServer(function (stream) {
    var sh = shux.attach('xyz');
    stream.pipe(sh).pipe(stream);
});
server.listen(5000);
```

You can connect to this server directly with netcat or telnet but it will have
annoying local echo and won't have a way to detach without externally killing
the process. Here's a client script you can use that detaches on `ctrl-a d`
(like gnu screen) and sets raw mode to turn off local echo:

client.js:

``` js
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
```

# methods

``` js
var shux = require('shux')
```

## var shx = shux()

Create a new shell multiplexer `shx`.

## var sh = shx.createShell(id, opts)

Create a shell with the name `id` or `opts.id`.

Return a duplex stream `sh` that can be hooked into the local stdin and stdout
to obtain a shell session. When the session ends, the shell will still be alive
and can be re-attached with `shx.attach(id)`.

Optionally, you can set:

* opts.command - the command to use for the shell, default: `'bash'`
* opts.arguments - extra arguments to pass to the `opts.command`, default: `[]`
* opts.columns - width of the session in characters
* opts.rows - height of the session in characters

## var sh = shx.attach(id, opts)

Connect to the session at `id` if it exists, returning a duplex stream `sh`.
Otherwise return `undefined`.

Optionally, you can set:

* opts.columns - width of the session in characters
* opts.rows - height of the session in characters

## shx.destroy(id, sig)

Send a kill signal to the shell process at `id`, if it exists.

## shx.list()

Return a list of the active shell id strings.

# events

## shx.on('spawn', function (id) {})

When a subshell gets spawned, the `'spawn'` event fires for that shell `id`.

## shx.on('exit', function (id) {})

When a subshell exits, the `'exit'` event fires for that shell `id`.

## shx.on('attach', function (id) {})

When a subshell is attached, the `'attach'` event fires for that shell `id`.

## shx.on('detach', function (id) {})

When a subshell is detached, the `'detach'` event fires for that shell `id`.

# install

With [npm](https://npmjs.org) do:

```
npm install shux
```

# license

MIT

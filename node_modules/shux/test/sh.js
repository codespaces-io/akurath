var test = require('tap').test;
var shux = require('../');

test('sh', function (t) {
    t.plan(2);
    
    var shx = shux();
    var times = { spawn: 0, exit: 0, attach: 0, detach: 0 };
    shx.on('spawn', function () { times.spawn ++ });
    shx.on('exit', function () { times.exit ++ });
    shx.on('attach', function () { times.attach ++ });
    shx.on('detach', function () { times.detach ++ });
    
    var sh0 = shx.createShell('xyz');
    
    var c = 0;
    sh0.on('data', function ondata () {
        if (++c < 2) return;
        sh0.removeListener('data', ondata);
        
        setTimeout(function () {
            sh0.write('echo beep boop');
        }, 100);
    });
    
    var data0 = '';
    sh0.on('data', function ondata (buf) {
        data0 += buf
        if (!/beep boop/.test(data0)) return;
        
        sh0.end();
        sh0.removeListener('data', ondata);
        
        var sh1 = shx.attach('xyz');
        var data1 = '';
        sh1.write('\n');
        sh1.on('data', function (buf) { data1 += buf });
        
        var iv = setInterval(function () {
            if (data1.match(/beep boop/g).length < 2) return;
            t.equal(data1.match(/beep boop/g).length, 2);
            clearInterval(iv);
            sh1.end();
            shx.destroy('xyz');
            
            setTimeout(function () {
                t.same(times, { spawn: 1, exit: 1, attach: 2, detach: 2 });
            }, 100);
        }, 500);
    });
});

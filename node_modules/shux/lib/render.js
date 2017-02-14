module.exports = function (dbuf) {
    var bufs = [], chars = [];
    var display, bgColor, fgColor;
    
    for (var i = 0; i < dbuf.data.length; i++) {
        var row = dbuf.data[i];
        
        for (var j = 0; j < row.length; j++) {
            var attr = row[j][0];
            var d = attr >> 18;
            var bg = attr & 0xff;
            var fg = (attr >> 9) & 0x1ff;
            
            if (d !== display) {
                bufs.push(Buffer(chars));
                chars = toCodes('[' + d + 'm');
            }
            
            if (bg !== bgColor && bg !== 256) {
                bufs.push(Buffer(chars));
                if (bg === 0) {
                    chars = toCodes('[0m');
                }
                else chars = toCodes('[' + (40 + bg) + 'm');
            }
            
            if (fg !== fgColor && fg !== 257) {
                bufs.push(Buffer(chars));
                chars = toCodes('[' + (30 + fg) + 'm');
            }
            
            display = d;
            bgColor = bg;
            fgColor = fg;
            
            chars.push(row[j][1].charCodeAt(0));
        }
        chars.push('\n'.charCodeAt(0));
    }
    bufs.push(Buffer(chars));
    return Buffer.concat(bufs);
}

function toCodes (s) {
    var codes = [ 0x1b ];
    for (var i = 0; i < s.length; i++) codes.push(s.charCodeAt(i));
    return codes;
}

/* Copyright (c) 2014 Sam Sykes, Gordon Williams. See the file LICENSE for copying permission. */
/*
Module for the SSD1306 OLED controller in displays like the Crius CO-16
```
function go(){
 // write some text
 g.drawString("Hello World!",2,2);
 // write to the screen
 g.flip();
}
// I2C
I2C1.setup({scl:B6,sda:B7});

var g = require("SSD1306").connect(I2C1, go);
// or
var g = require("SSD1306").connect(I2C1, go, { address: 0x3C });

// SPI
var s = new SPI();
s.setup({mosi: B6, sck:B5});
var g = require("SSD1306").connectSPI(s, A8, B7, go);
```
*/
export type SSD1306Options = {
    height?: number,
    contrast?: number,
    address?: number,
    rst?: Pin,
    cs?: Pin
}

var SSD1306 = (function () {
    var C = {
        OLED_WIDTH: 128,
        OLED_CHAR: 0x40,
        OLED_CHUNK: 1024
        //OLED_CHUNK: 128
    };

    // commands sent when initialising the display
    var extVcc = false; // if true, don't start charge pump
    var initCmds = new Uint8Array([
        0xAe, // 0 disp off
        0xD5, // 1 clk div
        0x80, // 2 suggested ratio
        0xA8, 63, // 3 set multiplex, height-1
        0xD3, 0x0, // 5 display offset
        0x40, // 7 start line
        0x8D, extVcc ? 0x10 : 0x14, // 8 charge pump
        0x20, 0x0, // 10 memory mode
        0xA1, // 12 seg remap 1
        0xC8, // 13 comscandec
        0xDA, 0x12, // 14 set compins, height==64 ? 0x12:0x02,
        0x81, extVcc ? 0x9F : 0xCF, // 16 set contrast
        0xD9, extVcc ? 0x22 : 0xF1, // 18 set precharge
        0xDb, 0x40, // 20 set vcom detect
        0xA4, // 22 display all on
        0xA6, // 23 display normal (non-inverted)
        0xAf // 24 disp on
    ]);

    // commands sent when sending data to the display
    var flipCmds = [
        0x21, // columns
        0, C.OLED_WIDTH - 1,
        0x22, // pages
        0, 7 /* (height>>3)-1 */];

    function update(options?: SSD1306Options) {
        if (options) {
            if (options.height) {
                initCmds[4] = options.height - 1;
                initCmds[15] = options.height == 64 ? 0x12 : 0x02;
                flipCmds[5] = (options.height >> 3) - 1;
            }
            if (options.contrast !== undefined) initCmds[17] = options.contrast;
        }
    }

    function connect(i2c: I2C, callback?: Function, options?: SSD1306Options) {
        update(options);
        var oled: any = Graphics.createArrayBuffer(C.OLED_WIDTH, initCmds[4] + 1, 1, { vertical_byte: true });
        oled.inverted = false;

        var addr = 0x3C;
        if (options) {
            if (options.address) addr = options.address;
            // reset display if 'rst' is part of options
            if (options.rst) digitalPulse(options.rst, false, 10);
        }

        setTimeout(function () {
            // configure the OLED
            initCmds.forEach(function (d) { i2c.writeTo(addr, [0, d]); });;
        }, 50);

        // write to the screen
        oled.flip = function () {
            // set how the data is to be sent (whole screen)
            flipCmds.forEach(function (d) { i2c.writeTo(addr, [0, d]); });;
            var chunk = new Uint8Array(C.OLED_CHUNK + 1);

            chunk[0] = C.OLED_CHAR;
            for (var p = 0; p < this.buffer.length; p += C.OLED_CHUNK) {
                chunk.set(new Uint8Array(this.buffer, p, C.OLED_CHUNK), 1);
                i2c.writeTo(addr, chunk);
            }
        };

        // set contrast, 0..255
        oled.setContrast = function (c: any) { i2c.writeTo(addr, 0, 0x81, c); };

        // set off
        oled.off = function () { i2c.writeTo(addr, 0, 0xAE); }

        // set on
        oled.on = function () { i2c.writeTo(addr, 0, 0xAF); }

        oled.invert = function() { var cmd = this.inverted ? 0xA6: 0xA7; i2c.writeTo(addr, 0, cmd); this.inverted = !this.inverted; }

        // if there is a callback, call it now(ish)
        if (callback !== undefined) setTimeout(callback.bind(oled), 100);

        // return graphics
        return oled;
    };

    return {
        connect
    };
})();

export default SSD1306;

"use strict";
exports.__esModule = true;
var net_1 = require("net");
var process_1 = require("process");
var tcpClient = new net_1["default"].Socket();
var HOST = "localhost";
var PORT = 12000;
var MILLISECONDS = 500;
var ERROR_CHANCE = 15;
function generate_and_send_battery_data() {
    var generated_value = 0;
    var error_flag = getRandomIntInclusive(1, ERROR_CHANCE);
    switch (error_flag) {
        case 1:
            generated_value = getRandomIntInclusive(82, 1000); // out of range
            break;
        case 2:
            generated_value = getRandomIntInclusive(0, 20); // out of range
            break;
        default:
            generated_value = getRandomIntInclusive(20, 80) + Math.random();
            break;
    }
    var data = {
        "battery_temperature": generated_value,
        "timestamp": Date.now()
    };
    if (!(tcpClient.destroyed || tcpClient.closed)) {
        var json_string = JSON.stringify(data);
        if (error_flag === 3) {
            // make invalid JSON string by adding an extra symbol
            json_string += '}';
        }
        tcpClient.write(json_string);
    }
    else {
        console.log("connection to server closed");
        (0, process_1.exit)();
    }
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
tcpClient.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
});
tcpClient.on('error', function (e) {
    console.log(e.message);
});
tcpClient.on("connect", function () {
    console.log("starting to generate and send emulated battery data every ".concat(MILLISECONDS, " milliseconds"));
    setInterval(generate_and_send_battery_data, MILLISECONDS);
});

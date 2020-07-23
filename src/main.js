"use strict";
exports.__esModule = true;
var webSocket_1 = require("rxjs/webSocket");
var subject = webSocket_1.webSocket("ws://localhost:8081");
subject.subscribe(function (msg) { return console.log('message received: ' + msg); }, function (err) { return console.log(err); }, function () { return console.log('complete'); });

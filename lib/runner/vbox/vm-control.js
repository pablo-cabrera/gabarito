"use strict";

var http = require("http");
var url = require("url");
var cp = require("child_process");

var handle;

var start = function (done) {
    if (!handle) {
        var args = (
                "-jar selenium-server-standalone-2.45.0.jar " +
                "-role node " +
                "-nodeConfig config.json " +
                "-Dwebdriver.ie.driver=IEDriverServer.exe").split(" ");

        handle = cp.spawn("java", args);

        handle.stderr.on("data", function (d) {
            process.stdout.write(d);
        });

        handle.stdout.on("data", function (d) {
            process.stdout.write(d);
        });
    }
    done();
};

var stop = function (done) {
    if (handle) {
        handle.on("close", function () { done(); });
        handle.kill();
        handle = undefined;
    } else {
        done();
    }
};

var register = function (req, res) {
    start(function () {
        console.log("started");

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("register");
    });
};

var unregister = function (req, res) {
    stop(function () {
        console.log("stopped");
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("unregister");
    });
};

var ping = function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("pong");
};

http.createServer(function (req, res) {
    switch (url.parse(req.url).pathname) {
    case "/register"    : return register(req, res);
    case "/unregister"  : return unregister(req, res);
    default             : return ping(req, res);
    }
}).listen(1432, "0.0.0.0");
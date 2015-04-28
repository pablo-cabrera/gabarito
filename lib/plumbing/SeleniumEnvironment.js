"use strict";

var Environment = require("./Environment");
var parts = require("parts");
var webdriver = require("selenium-webdriver");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");

var events = "init,complete,begin,end,enter,pass,fail,say".split(",");

module.exports = parts.tokens(function (
    driver,
    results,
    server,
    myCapabilities,
    myHub,
    myHost,

    startServer,
    dispatchBrowser,
    whenFinished,
    routeRequest,
    closeServer,
    deliverBrowserRunner,
    deliverAssets,
    deliverFile,
    receiveEvent,
    tellReporters
) {

    return Environment.descend(function (capabilities, hub, host) {
        myCapabilities.mark(this, capabilities);
        myHub.mark(this, hub);
        myHost.mark(this, host);

        driver.mark(this);
        server.mark(this);
        results.mark(this);
    }).

    proto(whenFinished, parts.that(function (that, done) {
        this[driver].executeScript("return window._gabaritoDone").
        then(function (r) {
            if (r) {
                that[driver].close().
                then(function () {
                    return that[driver].quit();
                }).
                then(function () { done(); });
            } else {
                setTimeout(function () { that[whenFinished](done); }, 500);
            }
        });
    })).

    proto(startServer, parts.that(function (that, files, reporters, done) {
        this[server] = http.createServer(function (req, res) {
            that[routeRequest](req, res, files, reporters);
        });

        this[server].listen(1432, "0.0.0.0", function () { done(); });
    })).

    proto(routeRequest, function (req, res, files, reporters) {
        switch (url.parse(req.url).pathname) {
        case "/"            : return this[deliverBrowserRunner](req, res, files);
        case "/assets.js"   : return this[deliverAssets](req, res);
        case "/event"       : return this[receiveEvent](req, res, reporters);
        default             : return this[deliverFile](req, res, files);
        }
    }).

    proto(deliverBrowserRunner, function (req, res, files) {
        var hooks =
            "var queue = [];" +
            "var verified = false;" +
            "var sending = false;" +

            "var end = function () {" +
                "window._gabaritoDone = !sending && verified;" +
            "};" +

            "var normalize = function (v) {" +
                "if (v instanceof Error) {" +
                    "return {" +
                        "toString: v.toString()," +
                        "stack: v.stack," +
                        "message: v.message" +
                    "};" +
                "} else if (parts.isArray(v)) {"+
                    "return parts.map(v, normalize);" +
                "} else if (parts.isObject(v)) {" +
                    "var o = {};" +
                    "parts.forEach(v, function (v, p) {" +
                        "o[p] = normalize(v);" +
                    "});" +
                    "return o;" +
                "}" +
                "return v;" +
            "};" +

            "var emit = parts.args(function (args) {" +
                "queue.push(args);" +
                "if (!sending) {" +
                    "sending = true;" +
                    "send();" +
                "}" +
            "});" +

            "var send = function () {" +
                "var args = queue[0];" +
                "var xhr = new XMLHttpRequest();" +
                "xhr.onreadystatechange = function () {" +
                    "if (xhr.readyState === 4) {" +
                        "xhr = null;" +
                        "queue.shift();" +
                        "if (queue.length !== 0) {" +
                            "send();" +
                        "} else { " +
                            "sending = false;" +
                            "end();" +
                        "}" +
                    "}" +
                "};" +
                "xhr.open(\"POST\", \"/event\", true);" +
                "xhr.send(JSON.stringify(normalize(args)));" +
            "};" +

            "var events = " + JSON.stringify(events) + ";" +

            "parts.forEach(events, function (e) {" +
                "gabarito.on(e, parts.args(function (args) {" +
                    "emit.apply(null, [e].concat(args)); " +
                "}));" +
            "});" +

            "gabarito.verify(function () {" +
                "verified = true;" +
                "end();" +
            "});";

        var html =
            "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">" +
            "<html>" +
                "<head>" +
                    "<title>gabarito runner</title>" +
                    "<meta charset=\"UTF-8\">" +
                    "<script src=\"/assets.js\"></script>" +
                        files.map(function (f) {
                            return "<script src=\"" +
                                    path.join("f", f) + "\"></script>";
                        }).join("") +
                        "<script>(function () {" + hooks + "}());</script>" +
                    "</head>" +
                "<body>" +
                    "<p>Running...</p>" +
                "</body>" +
            "</html>";

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
    }).

    proto(deliverAssets, function (req, res) {
        fs.readFile(require.resolve("./server/json2.js"), function (err, json2) {
            fs.readFile(require.resolve("parts"), function (err, parts) {
                fs.readFile(require.resolve("../gabarito"),
                        function (err, gabarito) {

                    res.writeHead(200, { "Content-Type": "text/javascript" });
                    res.end([json2, parts, gabarito].join("\n"));
                });
            });
        });
    }).

    proto(deliverFile, function (req, res, files) {
        var location = url.parse(req.url);
        var f = location.pathname.replace(/^\/f(.+)/, "$1");
        fs.readFile(f, function (err, file) {
            if (err) {
                res.statusCode = 404;
                res.end();
            } else {
                res.writeHead(200, { "Content-Type": "text/javascript" });
                res.end(file);
            }
        });
    }).

    proto(receiveEvent, parts.that(function (that, req, res, reporters) {
        var post = [];
        req.on("data", function (chunk) { post.push(chunk); });
        req.on("end", function () {
            var data = post.join("");
            var args = JSON.parse(data);
            var event = args.shift();

            that[tellReporters](reporters, event, args);

            if (event === "complete") {
                that[results] = args[0];
            }
        });

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end();
    })).

    proto(tellReporters, parts.that(function (that, reporters, event, args) {
        reporters.forEach(function (r) {
            r[event].apply(r, [that].concat(args));
        });
    })).

    proto(closeServer, function (done) {
        this[server].close(function () { done(); });
        this[server] = undefined;
    }).

    proto(dispatchBrowser, function (done) {
        this[driver] = new webdriver.Builder().
                withCapabilities(this[myCapabilities]).
                usingServer("http://" + this[myHub] + "/wd/hub").
                build();

        this[driver].get("http://" + this[myHost] + ":1432").
        then(function () { done(); });
    }).

    proto({

        getName: function () {
            var version = this[myCapabilities].version;
            var platform = this[myCapabilities].platform;

            var name = "Selenium[" + this[myCapabilities].browserName;

            if (version) {
                name += ":" + version;
            }

            if (platform) {
                name += ":" + platform;
            }

            name += "]";
            return name;
        },

        dispatch: parts.that(function (that, files, reporters, done) {
            this[startServer](files, reporters, function () {
                that[dispatchBrowser](function () {
                    that[whenFinished](function () {
                        that[closeServer](function () {
                            done(that[results]);
                        });
                    });
                });
            });

        })
    }).

    shared({
        capabilities: myCapabilities,
        hub: myHub,
        host: myHost
    });
});
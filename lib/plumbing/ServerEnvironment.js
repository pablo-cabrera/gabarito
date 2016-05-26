"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");

var Environment = require("./Environment");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");

var events = "init,complete,begin,end,enter,pass,fail,say".split(",");

module.exports = ilk.tokens(function (
    results,
    server,

    startServer,
    dispatchBrowser,
    whenFinished,
    routeRequest,
    closeServer,
    deliverBrowserRunner,
    deliverAssets,
    deliverFile,
    receiveEvent,
    tellReporters,
    concatFiles
) {

    return Environment.descend(function () {
        server.mark(this);
        results.mark(this);
    }).

    proto(whenFinished, function (done) {
        throw new Error("Unimplemented method");
    }).

    proto(startServer, parts.that(function (that, files, reporters, done) {
        this[server] = http.createServer(function (req, res) {
            that[routeRequest](req, res, files, reporters);
        });

        this[server].listen(1432, "0.0.0.0", function () { done(); });
    })).

    proto(routeRequest, function (req, res, files, reporters) {
        switch (url.parse(req.url).pathname) {
        case "/"          : return this[deliverBrowserRunner](req, res, files);
        case "/assets.js" : return this[deliverAssets](req, res);
        case "/event"     : return this[receiveEvent](req, res, reporters);
        default           : return this[deliverFile](req, res, files);
        }
    }).

    proto(deliverBrowserRunner, function (req, res, files) {
        var hooks =
            "var queue = [];" +
            "var verified = false;" +
            "var sending = false;" +
            "var parts = gabarito.parts;" +

            "var end = function () {" +
                "window.$gabaritoDone = !sending && verified;" +
            "};" +

            "var normalize = function (v) {" +
                "if (v instanceof Error) {" +
                    "return {" +
                        "toString: v.toString()," +
                        "stack: v.stack," +
                        "message: v.message" +
                    "};" +
                "} else if (parts.isArray(v)) {" +
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
            "<!DOCTYPE HTML PUBLIC \"-" +
                    "//W3C//DTD HTML 4.01 Transitional//EN\">" +

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

    proto(concatFiles, function (files, callback) {
        var data = {};

        var check = function () {
            if (files.every(function (f) { return f in data; })) {
                callback(files.reduce(function (prev, file) {
                    return prev += data[file] + "\n";
                }, ""));
            }
        };

        files.forEach(function (f) {
            fs.readFile(f, function (e, d) {
                data[f] = d;
                check();
            });
        });
    }).

    proto(deliverAssets, function (req, res) {
        this[concatFiles]([
            require.resolve(root + "/deps/json2.js"),
            require.resolve(root + "/deps/parts"),
            require.resolve(root + "/deps/ilk"),
            require.resolve("../gabarito")
        ], function (data) {
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.end(data);
        });
    }).

    proto(deliverFile, function (req, res, files) {
        var location = url.parse(req.url);
        var n = location.pathname;
        var f = (/^\/r\//).test(n)?
                path.join(process.cwd(), n.replace(/^\/r\/(.+)/, "$1")):
                n.replace(/^\/f(.+)/, "$1");

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
        throw new Error("Unimplemented method");
    }).

    proto({

        getName: function () {
            throw new Error("Unimplemented method");
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
        dispatchBrowser: dispatchBrowser,
        whenFinished: whenFinished
    });
});
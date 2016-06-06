"use strict";

var gabarito = require("../../../lib/gabarito");
var parts = require("../../../deps/parts");

var ServerEnvironment = require("../../../lib/plumbing/ServerEnvironment");

var assert = gabarito.assert;
var spy = gabarito.spy;
var matcher = gabarito.matcher;

var shared, MyEnv, env, http, fs, handler, reporter;

var setupMockServer = function () {
    reporter = {};

    http.createServer = spy(parts.constant({
        listen: function (port, address, done) { done(); } }));
    env[shared.dispatchBrowser] = function (done) { done(); };
    env.dispatch([], [reporter], parts.k);

    var handlerGrabber = matcher.grabber();
    http.createServer.verify().args(handlerGrabber);
    handler = handlerGrabber.grab();
};

var matchFile = function (f) {
    return matcher(function (v) {
        return v.indexOf(f) === (v.length - f.length);
    });
};

gabarito.test("gabarito.plumbing.ServerEnvironmentTest").

before(function () {
    handler = null;
    shared = {};
    http = {};
    fs = {};
    MyEnv = ServerEnvironment.descend(shared);
    env = new MyEnv(http, fs);
}).

clause("dispatchBrowser should throw \"Unimplemented method.\"", function () {
    env[shared.dispatchBrowser] = spy(env[shared.dispatchBrowser]);
    parts.silence(function () { env[shared.dispatchBrowser](); });
    env[shared.dispatchBrowser].verify().
        throwing(matcher(function (e) {
            return e.message === "Unimplemented method.";
        }));
}).

clause("ditchBrowser should call the callback function", function () {
    var callback = spy();
    env[shared.ditchBrowser](callback);
    callback.verify();
    callback.noCalls();
}).

clause(
"dispatch should start the server, " +
"dispatch the browser and " +
"whenFinished should ditch the browser, " +
"close the server and " +
"call the callback function passing the results", function (ctx) {
    var files = ["a", "b", "c"];
    var reporter = {
        complete: spy()
    };

    var done = spy();

    var server = {
        listen: spy(function (port, address, done) { done(); }),
        close: spy(function (done) { done(); })
    };


    http.createServer = spy(parts.constant(server));

    env[shared.dispatchBrowser] = spy(function (done) { done(); });

    env.dispatch(files, [reporter], done);

    var handlerGrabber = matcher.grabber();
    http.createServer.verify().args(handlerGrabber);
    server.listen.verify();
    env[shared.dispatchBrowser].verify();

    handler = handlerGrabber.grab();

    var req = {
        url: "http://host/event",
        on: spy()
    };

    var res = {
        writeHead: spy(),
        end: spy()
    };

    handler(req, res);

    res.writeHead.verify().args(200, { "Content-Type": "text/plain" });
    res.end.verify();

    var result = { result: "results!" };

    var onDataGrabber = matcher.grabber();
    req.on.verify().args("data", onDataGrabber);
    onDataGrabber.grab()(JSON.stringify(["complete", result]));

    var onEndGrabber = matcher.grabber();
    req.on.verify().args("end", onEndGrabber);
    onEndGrabber.grab()();

    ctx.stay();

    env[shared.ditchBrowser] = ctx.going(function (callback) {
        callback();
        server.close.verify();
        done.verify().args(result);
        reporter.complete.verify().args(env, result);
    });

}).

clause("request to \"/\" should deliver the browser runner", function () {
    setupMockServer();

    var req = { url: "http://host/" };

    var res = {
        writeHead: spy(),
        end: spy()
    };

    handler(req, res);

    res.writeHead.verify().args(200, { "Content-Type": "text/html" });

    var responseGrabber = matcher.grabber();
    res.end.verify().args(responseGrabber);

    // just check the beginning of it...
    assert.that(responseGrabber.grab().indexOf(
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">" +
        "<html><head><title>gabarito runner</title>")).
        isTheSameAs(0);
}).

clause(
"request to \"/assets.js\" should deliver the concatenated assets",
function () {
    setupMockServer();

    var req = { url: "http://host/assets.js" };

    var res = {
        writeHead: spy(),
        end: spy()
    };

    fs.readFileSync = spy(parts.constant(""));

    handler(req, res);
    fs.readFileSync.verify().args(matchFile("deps/json2.js"));
    fs.readFileSync.verify().args(matchFile("deps/parts.js"));
    fs.readFileSync.verify().args(matchFile("deps/ilk.js"));
    fs.readFileSync.verify().args(matchFile("lib/gabarito.js"));
    fs.readFileSync.noCalls();

    res.writeHead.verify().args(200, { "Content-Type": "text/javascript" });
    res.end.verify().args("\n\n\n");
}).

clause("request to \"/event\" should receive an event and notify the reporters",
function () {
    setupMockServer();

    var req = {
        url: "http://host/event",
        on: spy()
    };

    var res = {
        writeHead: spy(),
        end: spy()
    };

    reporter.begin = spy();

    handler(req, res);

    var onDataGrabber = matcher.grabber();
    req.on.verify().args("data", onDataGrabber);
    onDataGrabber.grab()(JSON.stringify(["begin", 1, 2, 3]));

    var onEndGrabber = matcher.grabber();
    req.on.verify().args("end", onEndGrabber);
    onEndGrabber.grab()();

    res.writeHead.verify().args(200, { "Content-Type": "text/plain" });
    res.end.verify();

    reporter.begin.verify().args(env, 1, 2, 3);
}).

clause("request to \"/r\" should deliver a relative file", function () {
    setupMockServer();

    var req = { url: "http://host/r/some-file.js" };

    var res = {
        writeHead: spy(),
        end: spy()
    };

    fs.readFile = spy();

    handler(req, res);

    var grabber = matcher.grabber();
    fs.readFile.verify().args(matchFile("some-file.js"), grabber);
    grabber.grab()(null, "content");

    res.writeHead.verify().args(200, { "Content-Type": "text/javascript" });
    res.end.verify().args("content");
}).


clause("request to \"/f\" should deliver an absolute file", function () {
    setupMockServer();

    var req = { url: "http://host/f/some-file.js" };

    var res = {
        writeHead: spy(),
        end: spy()
    };

    fs.readFile = spy();

    handler(req, res);

    var grabber = matcher.grabber();
    fs.readFile.verify().args("/some-file.js", grabber);
    grabber.grab()(null, "content");

    res.writeHead.verify().args(200, { "Content-Type": "text/javascript" });
    res.end.verify().args("content");
});

"use strict";

var gabarito = require("../../../lib/gabarito");
var parts = require("../../../deps/parts");

var NodeEnvironment = require("../../../lib/plumbing/NodeEnvironment");

var assert = gabarito.assert;
var spy = gabarito.spy;
var matcher = gabarito.matcher;

gabarito.test("gabarito.plumbing.NodeEnvironmentTest").

clause("getName should return Node.js", function () {
    var env = new NodeEnvironment();
    assert.that(env.getName()).
        isEqualTo("Node.js");
}).
clause(
"dispatch should reset gabarito, " +
"attach the reporters into gabarito, " +
"load files into gabarito and call gabarito's verify", function () {
    var events = "init,complete,begin,end,enter,pass,fail,say,error".split(",");

    var files = ["a", "b", "c"];

    var reporter = {};
    events.forEach(function (e) { reporter[e] = spy(); });

    var envGabarito = {
        reset: spy(function () {
            envGabarito.verify.noCalls();
            envRequire.noCalls();
            envRequire.resolve.noCalls();
        }),
        on: spy(),
        verify: spy()
    };

    var envRequire = spy();
    parts.merge(envRequire, {
        cache: {
            "a": null,
            "b": null,
            "c": null
        },
        resolve: spy(function (v) { return v; })
    });


    var env = new NodeEnvironment(envGabarito, envRequire);
    env.dispatch(files, [reporter], parts.k);

    envGabarito.reset.verify();
    envGabarito.reset.noCalls();

    events.forEach(function (e) {
        var grabber = matcher.grabber();
        envGabarito.on.verify().args(e, grabber);
        grabber.grab().call(null, 1, 2, 3);

        reporter[e].verify().
            args(env, 1, 2, 3).
            withThis(reporter);

        reporter[e].noCalls();
    });

    envGabarito.on.noCalls();

    files.forEach(function (f) {
        assert.that(envRequire.cache).dhop(f);
        envRequire.resolve.verify().args(f);
        envRequire.verify().args(f);
    });

    envRequire.resolve.noCalls();
    envRequire.noCalls();

    envGabarito.verify.verify();
    envGabarito.verify.noCalls();
});

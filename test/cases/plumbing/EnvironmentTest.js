"use strict";

var parts = require("../../../deps/parts");
var gabarito = require("../../../lib/gabarito");
var Environment = require("../../../lib/plumbing/Environment");

var matcher = gabarito.matcher;
var spy = gabarito.spy;

var env;

gabarito.test("gabarito.plumbing.EnvironemntTest").

before(function () {
    env = new Environment();
}).

clause("getName should throw \"Unimplemented method.\"", function () {
    env.getName = spy(env.getName);
    parts.silence(function () { env.getName(); });
    env.getName.verify().throwing(matcher(function (e) {
        return e.message === "Unimplemented method.";
    }));
}).

clause("dispatch should throw \"Unimplemented method.\"", function () {
    env.dispatch = spy(env.dispatch);
    parts.silence(function () { env.dispatch(); });

    env.dispatch.verify().throwing(matcher(function (e) {
        return e.message === "Unimplemented method.";
    }));
});

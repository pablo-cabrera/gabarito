"use strict";

var gabarito = require("../../../lib/gabarito");
var Environment = require("../../../lib/plumbing/Environment");

var assert = gabarito.assert;

var env;

gabarito.test("gabarito.plumbing.EnvironemntTest").

before(function () {
    env = new Environment();
}).



clause("getName should throw \"Unimplemented method.\"", function () {
    try {
        env.getName();
    } catch (e) {
        assert.that(e).isInstanceOf(Error);
        assert.that(e.message).isEqualTo("Unimplemented method.");
    }
}).
clause("dispatch should throw \"Unimplemented method.\"", function () {
    try {
        env.dispatch();
    } catch (e) {
        assert.that(e).isInstanceOf(Error);
        assert.that(e.message).isEqualTo("Unimplemented method.");
    }
});

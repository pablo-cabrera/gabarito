(function (node) {
    "use strict";

    var main = node? global: window;

    var gabarito;
    var parts;

    if (node) {
        gabarito = require("../../lib/gabarito");
        parts = require("../../deps/parts");
    } else {
        gabarito = main.gabarito;
        parts = gabarito.parts;
    }

    var assert = gabarito.assert;
    var spy = gabarito.spy;
    var matcher = gabarito.matcher;

    var s;
    var o = {};

    gabarito.test("gabarito.SpyTest").

    before(function () {
        s = spy(parts.constant(o));
    }).

    clause("should call the function", function () {
        var called = false;

        var f = function () {
            called = true;
        };

        var s = spy(f);
        s();

        assert.that(called).isTrue();
    }).

    clause("should have the same parameters", function () {
        var arg = {};
        var f = parts.args(function (args) {
            assert.that(args.length).isEqualTo(1);
            assert.that(args[0]).isTheSameAs(arg);
        });

        var s = spy(f);
        s(arg);
    }).

    clause("should have the same this", function () {
        var someThis = {};

        var f = function () {
            assert.that(this).isTheSameAs(someThis);
        };

        var s = spy(f);
        s.call(someThis);
    }).

    clause("should return the same returned value", function () {
        var result = {};
        var f = parts.constant(result);
        var s = spy(f);
        var anotherResult = s();
        assert.that(anotherResult).isTheSameAs(result);
    }).

    clause("should throw the same error", function () {
        var error = new Error();
        var f = function () { throw error; };
        var s = spy(f);
        try {
            s();
        } catch (e) {
            assert.that(e).isTheSameAs(error);
        }
    }).

    clause("verify should throw if no calls were made", function () {
        try {
            s.verify();
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("No calls were made.");
        }
    }).

    clause("verify should work for the same number of calls", function () {
        s();
        s.verify();
        try {
            s.verify();
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("No calls were made.");
        }
    }).

    clause("args should throw if no args are provided", function () {
        s();
        try {
            s.verify().args();
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("No args to check.");
        }
    }).

    clause("args should throw if a matcher fails", function () {
        s(1);
        try {
            s.verify().args(matcher(parts.constant(false)));
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("Argument mismatch.");
        }
    }).

    clause(
    "args should throw if there are different number of args and no " +
    "VarargsMatcher is present",
    function () {
        s();
        try {
            s.verify().args(1);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).
                    isEqualTo("Args number mismatch: 0 args passed.");
        }
    }).

    clause("args should throw if the Varargs is not the last one", function () {
        s(1, 2);
        try {
            s.verify().args(matcher.args(parts.constant(true)), 1);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).
                    isEqualTo("VarargsMatcher should be the last matcher.");
        }
    }).

    clause("args should pass all the remaining args for the VarargsMatcher",
    function () {
        s(1, 2, 3);

        var passedArgs;
        var argsMatcher = matcher.args(function (args) {
            passedArgs = args;
            return true;
        });

        s.verify().args(1, argsMatcher);

        assert.that(passedArgs).isEqualTo([2, 3]);
    }).

    clause("args should call each matcher",
    function () {
        var called1 = false;
        var called2 = false;

        var m1 = matcher(function (v1) {
            assert.that(v1).isTheSameAs(1);
            called1 = true;
            return true;
        });

        var m2 = matcher(function (v2) {
            assert.that(v2).isTheSameAs(v2);
            called2 = true;
            return true;
        });

        s(1, 2);

        s.verify().args(m1, m2);

        assert.that(called1).isTrue();
        assert.that(called2).isTrue();
    }).

    clause(
    "args should use the default matcher for values that are not matchers",
    function () {
        s(1);
        s.verify().args(1);

        s(1);

        try {
            s.verify().args(2);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("Argument mismatch.");
        }
    }).

    clause("returning should throw if the matcher fails", function () {
        s();

        try {
            s.verify().returning(matcher(parts.constant(false)));
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("Return mismatch.");
        }
    }).
    clause(
    "returning should use the default matcher for a value that is not a " +
    "matcher",
    function () {
        s();
        s.verify().returning({});

        s();
        try {
            s.verify().returning(1);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("Return mismatch.");
        }
    }).

    clause("throwing should throw if the matcher fails", function () {
        var error = new Error();
        s = spy(function () { throw error; });
        try { s(); } catch (e) { }

        try {
            s.verify().throwing(matcher(parts.constant(false)));
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("Error mismatch.");
        }

    }).

    clause(
    "throwing should use the default matcher for a value that is not a " +
    "matcher", function () {
        var error = new Error();
        s = spy(function () { throw error; });

        try { s(); } catch (e) { }
        s.verify().throwing(error);

        try { s(); } catch (e) { }
        try {
            s.verify().throwing(1);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("Error mismatch.");
        }

    }).

    clause("noCalls should throw if a call was made", function () {
        s();
        try {
            s.noCalls();
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).isEqualTo("A call was made.");
        }
    }).

    clause("noCalls should pass if no calls were made", function () {
        s.noCalls();
    });


}(typeof exports !== "undefined" && global.exports !== exports));

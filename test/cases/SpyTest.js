(function (node) {
    "use strict";

    var main = node? global: window;

    var gabarito;
    var parts;

    if (node) {
        var root = "../../test/coverage/instrument";
        if (!require("fs").existsSync(root)) {
            root = "../..";
        }

        gabarito = require(root + "/test/coverage/instrument/lib/gabarito");
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

    clause("shoud use an empty function if no function is passed", function () {
        s = spy();
        s();
        s.verify();
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
            assert.that(args[0]).sameAs(arg);
        });

        var s = spy(f);
        s(arg);
    }).

    clause("should have the same this", function () {
        var someThis = {};

        var f = function () {
            assert.that(this).sameAs(someThis);
        };

        var s = spy(f);
        s.call(someThis);
    }).

    clause("should return the same returned value", function () {
        var result = {};
        var f = parts.constant(result);
        var s = spy(f);
        var anotherResult = s();
        assert.that(anotherResult).sameAs(result);
    }).

    clause("should throw the same error", function () {
        var error = new Error();
        var f = function () { throw error; };
        var s = spy(f);
        try {
            s();
        } catch (e) {
            assert.that(e).sameAs(error);
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
            assert.that(e.message).
                    isEqualTo("Value mismatch.\nValue: <n: 1>");
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
            assert.
                that(e.message).
                isEqualTo("Args number mismatch: 0 args passed, expected 1.");
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
            assert.that(v1).sameAs(1);
            called1 = true;
            return true;
        });

        var m2 = matcher(function (v2) {
            assert.that(v2).sameAs(v2);
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
            assert.that(e.message).
                    isEqualTo(
                            "1st argument mismatch.\n" +
                            "Expected: <n: 2>\n" +
                            "Actual: <n: 1>");
        }
    }).

    clause("returning should throw if the matcher fails", function () {
        s();

        try {
            s.verify().returning(matcher(parts.constant(false)));
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).
                    isEqualTo("Value mismatch.\nValue: <0:o: {}>");
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
            assert.that(e.message).
                    isEqualTo("Return mismatch.\nReturn: <0:o: {}>");
        }
    }).

    clause("throwing should throw if the matcher fails", function () {
        var error = new Error();
        s = spy(function () { throw error; });
        parts.silence(s);

        try {
            s.verify().throwing(matcher(parts.constant(false)));
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message.indexOf("Value mismatch")).sameAs(0);
        }

    }).

    clause(
    "throwing should use an identity matcher for a value that is not a " +
    "matcher", function () {
        var error = new Error();
        s = spy(function () { throw error; });

        parts.silence(s);
        s.verify().throwing(error);

        parts.silence(s);
        try {
            s.verify().throwing(1);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message.indexOf("Error mismatch")).sameAs(0);
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
    }).

    clause("reset should remove all the calls from within the spy",
    function () {
        s();
        s.reset();
        s.noCalls();
    }).

    clause("withThis should throw if the matcher fails", function () {
        s();

        try {
            s.verify().withThis(matcher(parts.constant(false)));
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message.indexOf("Value mismatch")).sameAs(0);
        }
    }).

    clause(
    "withThis should use an identity matcher for a value that is not a " +
    "matcher",
    function () {
        var that = {};
        s.call(that);
        s.verify().withThis(that);

        s();
        try {
            s.verify().withThis(that);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message.indexOf("This mismatch")).sameAs(0);
        }

    }).

    clause("after should throw if a call was made before another one",
    function () {
        s();
        s();

        var call1 = s.verify();
        var call2 = s.verify();

        call2.after(call1);
        try {
            call1.after(call2);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).sameAs("Call made before.");
        }
    }).

    clause("before should throw if a call was made after another one",
    function () {
        s();
        s();

        var call1 = s.verify();
        var call2 = s.verify();

        call1.before(call2);
        try {
            call2.before(call1);
        } catch (e) {
            assert.that(e).isInstanceOf(Error);
            assert.that(e.message).sameAs("Call made after.");
        }

    });


}(typeof exports !== "undefined" && global.exports !== exports));

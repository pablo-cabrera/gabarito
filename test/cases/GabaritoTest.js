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

        gabarito = require(root + "/lib/gabarito");
        parts = require("../../deps/parts");
    } else {
        gabarito = main.gabarito;
        parts = gabarito.parts;
    }

    var assert = gabarito.assert;

    var g;

    gabarito.test("gabarito.GabaritoTest").

    before(function () {
        g = gabarito.standalone();
    }).

    clause("should run every clause within the test", function () {
        var a, b, c;

        g.add({
            name: "some name",
            a: function () { a = 1; },
            b: function () { b = 2; },
            c: function () { c = 3; }
        });

        g.verify();

        assert.areSame(1, a);
        assert.areSame(2, b);
        assert.areSame(3, c);
    }).

    clause("should pass when a test doesn't throws", function () {
        g.add({ c: parts.k });
        g.verify(function (r) {
            assert.isFalse(parts.hop(r[0].results.c, "error"));
        });
    }).

    clause("should fail when a test throws", function () {
        var e;

        g.add({
            c: function () {
                e = new Error("yo");
                throw e;
            }
        });

        g.verify(function (r) {
            assert.areSame(e, r[0].results.c.error);
        });
    }).

    clause("should return an array containing the results for each test",
    function () {
        var test = {
            name: "some name",
            a: function () {},
            b: function () {},
            c: function () {}
        };

        g.add(test);
        g.add(test);

        g.verify(function (results) {
            assert.isArray(results);
            assert.areSame(2, results.length);
            var r = results[0];

            assert.areSame(test.name, r.test);
            assert.isNumber(r.start);
            assert.isNumber(r.elapsedTime);

            assert.areSame(3, parts.map(r.results,
                    function (v, p) { return p; }).length);

            parts.forEach(r.results, function (r) {
                assert.isNumber(r.start);
                assert.isNumber(r.elapsedTime);
            });
        });
    }).

    clause("should timeout at specified time", function (ctx) {
        var t;

        g.add({
            c: function (gCtx) {
                t = parts.now();
                gCtx.stay(500);
            }
        });

        g.verify(ctx.going(function (r) {
            var delta = parts.now() - t;
            assert.isTrue(delta >= 500);
            assert.isTrue(delta <= 1500);
            assert.areSame(r[0].results.c.error.message,
                    "Timeout reached.");
        }));

        ctx.stay(1500);
    }).

    clause("should fail when stay is called while waiting", function (ctx) {
        g.add({
            c: function (gCtx) {
                gCtx.stay();
                gCtx.stay();
            }
        });

        g.verify(function (r) {
            assert.areSame(r[0].results.c.error.message,
                    "Already waiting.");
        });
    }).

    clause("should fail when go is called while going", function () {
        g.add({ c: function (gCtx) { gCtx.go(); } });

        g.verify(function (r) {
            assert.areSame(r[0].results.c.error.message,
                    "Go called without stay.");
        });
    }).

    clause("should pass when an async test doesnt throw", function (ctx) {
        g.add({
            c: function (gCtx) {
                gCtx.stay();
                parts.work(gCtx.going());
            }
        });

        g.verify(ctx.going(function (r) {
            assert.isFalse(parts.hop(r[0].results.c, "error"));
        }));

        ctx.stay();
    }).

    clause("should fail when an async test throws", function (ctx) {
        var e;
        g.add({
            c: function (gCtx) {
                gCtx.stay();
                parts.work(gCtx.going(function () {
                    e = new Error("yo");
                    throw e;
                }));
            }
        });

        g.verify(ctx.going(function (r) {
            assert.areSame(r[0].results.c.error, e);
        }));

        ctx.stay();
    }).

    clause("should emit an error if a go is called after the test has finished",
    function (ctx) {
        g.on("error", ctx.going(function (error) {
            assert.that(error).isInstanceOf(Error);
            assert.that(error.message).sameAs("Context has already run.");
        }));

        g.test("test").
        clause("clause", function (gCtx) {
            gCtx.stay();
            parts.work(gCtx.going());
            parts.work(gCtx.going());
        });

        ctx.stay();

        g.verify();
    });



}(typeof exports !== "undefined" && global.exports !== exports));

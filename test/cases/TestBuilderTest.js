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

    var g;

    gabarito.test("gabarito.TestBuilder").

    before(function () {
        g = gabarito.standalone();
    }).

    clause("gabarito.test should add a test with the given name", function () {
        g.test("some test").
        clause("some clause", parts.k);

        g.verify(function (results) {
            assert.that(results).hasSizeOf(1);
            assert.that(results[0].test).isTheSameAs("some test");
        });
    }).

    clause("should use the name as the test's name", function () {
        g.test().
        name("some test").
        clause("some clause", parts.k);

        g.verify(function (results) {
            assert.that(results).hasSizeOf(1);
            assert.that(results[0].test).isTheSameAs("some test");
        });
    }).

    clause("should use the function as before within the test", function () {
        var before = spy(function () {
            clause.noCalls();
        });

        var clause = spy(function () {
            before.verify();
        });

        g.test("test").
        before(before).
        clause("clause", clause);

        g.verify();

        clause.verify();
    }).

    clause("should use the function as after within the test", function () {
        var after = spy(function () {
            clause.verify();
        });

        var clause = spy(function () {
            after.noClause();
        });

        g.test("test").
        after(after).
        clause("clause", clause);

        g.verify();

        after.verify();

    }).

    clause("should add the clause as a new clause within the test",
    function () {
        var clause = spy(parts.k);

        g.test("test").
        clause("clause", clause);

        g.verify();

        clause.verify();
    });

}(typeof exports !== "undefined" && global.exports !== exports));

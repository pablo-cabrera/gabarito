"use strict";

var cwd = process.cwd();
var root = cwd + "/test/coverage/instrument";
if (!require("fs").existsSync(root)) {
    root = cwd;
}

var gabarito = require("../../../lib/gabarito");
var parts = require("../../../deps/parts");

var PhantomEnvironment = require(root + "/lib/plumbing/PhantomEnvironment");

var assert = gabarito.assert;
var spy = gabarito.spy;
var matcher = gabarito.matcher;

var shared, env, phantom, instance, page;

gabarito.test("gabarito.plumbing.PhantomEnvironmentTest").

before(function () {
    shared = {};

    instance = {
        createPage: spy(function () {
            return { then: function (f) { return f(page); } };
        }),

        exit: spy()
    };

    page = {
        open: spy(function () {
            return { then: function (f) { return f(); } };
        }),
        close: spy()
    };


    phantom = {
        create: spy(function () {
            return { then: function (f) { return f(instance); } };
        })
    };

    env = new (PhantomEnvironment.descend(shared))(phantom);
}).

clause("getName should return \"PhantomJS\"", function () {
    assert.that(env.getName()).sameAs("PhantomJS");
}).

clause(
"dispatchBrowser should create an instance, " +
"create a page, open \"http://localhost:1432\" " +
"and call the callback",
function () {
    var done = spy();

    env[shared.dispatchBrowser](done);

    phantom.create.verify();
    instance.createPage.verify();
    page.open.verify().args("http://localhost:1432");
    done.verify();
}).

clause(
"ditchBrowser should close the page, exit the instance and call the callback",
function () {
    var done = spy();

    env[shared.dispatchBrowser](parts.k);
    env[shared.ditchBrowser](done);

    page.close.verify();
    instance.exit.verify();
    done.verify();
});

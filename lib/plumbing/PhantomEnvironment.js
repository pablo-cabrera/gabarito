"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");

var ServerEnvironment = require("./ServerEnvironment");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var phantom = require("phantom");

var shared = {};

module.exports = ilk.tokens(function (
    instance,
    page
) {
    /**
     * The PhantomEnvironment uses the phantomjs to navigate to
     * "http://localhost:1432" in order to run the tests.
     *
     * @class gabarito.plumbing.PhantomEnvironment
     * @extends gabarito.plumbing.ServerEnvironment
     * @constructor
     */
    return ServerEnvironment.descend(function () {
        ServerEnvironment.call(this);
        instance.mark(this, null);
        page.mark(this, null);
    }, shared).

    proto(shared.dispatchBrowser, parts.that(function (that, done) {
        phantom.create().then(function (i) {
            that[instance] = i;
            return i.createPage();
        }).then(function (p) {
            that[page] = p;
            return p.open("http://localhost:1432");
        }).then(function () {
            done();
        });
    })).

    proto(shared.ditchBrowser, function (done) {
        this[page].close();
        this[instance].exit();
        this[page] = null;
        this[instance] = null;
        done();
    }).

    proto({ getName: parts.constant("PhantomJS") });

});

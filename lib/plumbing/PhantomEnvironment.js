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
    return ServerEnvironment.descend(function () {
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

    proto(shared.whenFinished, parts.that(function (that, done) {
        this[page].evaluateJavaScript(
                "function () { return window.$gabaritoDone; }").
        then(function (r) {
            if (r) {
                that[page].close();
                that[instance].exit();
                that[page] = null;
                that[instance] = null;
                done();
            } else {
                setTimeout(function () { that[shared.whenFinished](done); }, 500);
            }
        });

    })).

    proto({ getName: parts.constant("PhantomJS") });

});

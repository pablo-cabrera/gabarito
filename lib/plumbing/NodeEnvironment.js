"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");
var Gabarito = require(root + "/lib/gabarito");
var Environment = require("./Environment");

module.exports = ilk.tokens(function (
    gabarito,
    nodeRequire,

    attachReporter,
    loadFile
) {
    /**
     * The NodeEnvironment runs the tests under the node-js itself. It loades
     * the files using the require mechanism, but it deletes them from the
     * node's cache beforehand.
     *
     *
     * @class gabarito.plumbing.NodeEnvironment
     * @extends gabarito.plumbing.Environment
     * @constructor
     *
     * @param {gabarito.Gabarito} [gabarito] A gabarito instance
     * @param {Module/require} [require] The module.require function
     */
    return Environment.descend(function (pGabarito, pRequire) {
        gabarito.mark(this, pGabarito || require(root + "/lib/gabarito"));
        nodeRequire.mark(this, pRequire || require);
    }).

    proto(attachReporter, parts.that(function (that, reporter) {
        Gabarito.constant("EVENTS").forEach(function (e) {
            that[gabarito].on(e, parts.args(function (args) {
                reporter[e].apply(reporter, [that].concat(args));
            }));
        });
    })).

    proto(loadFile, function (file) {
        delete this[nodeRequire].cache[this[nodeRequire].resolve(file)];
        this[nodeRequire](file);
    }).

    proto({
        getName: parts.constant("Node.js"),

        dispatch: parts.that(function (that, files, reporters, done) {
            this[gabarito].reset();

            reporters.forEach(function (r) { that[attachReporter](r); });
            files.forEach(function (f) { that[loadFile](f); });

            this[gabarito].verify(done);
        })
    });

});

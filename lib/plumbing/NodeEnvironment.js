"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");
var Environment = require("./Environment");


var events = "init,complete,begin,end,enter,pass,fail,say".split(",");

module.exports = ilk.tokens(function (
    myGabarito,

    attachReporter,
    loadFile
) {
    return Environment.descend(function (gabarito) {
        myGabarito.mark(this, gabarito);
    }).

    proto(attachReporter, parts.that(function (that, reporter) {
        events.forEach(function (e) {
            that[myGabarito].on(e, parts.args(function (args) {
                reporter[e].apply(reporter, [that].concat(args));
            }));
        });
    })).

    proto(loadFile, function (file) {
        delete require.cache[require.resolve(file)];
        require(file);
    }).

    proto({
        getName: parts.constant("Node.js"),

        dispatch: parts.that(function (that, files, reporters, done) {
            this[myGabarito].reset();

            reporters.forEach(function (r) { that[attachReporter](r); });
            files.forEach(this[loadFile]);

            this[myGabarito].verify(done);
        })
    });

});
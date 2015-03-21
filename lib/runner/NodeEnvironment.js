"use strict";

var Environment = require("./Environment");
var parts = require("parts");


var events = ["init", "complete", "begin", "end", "enter", "pass", "fail"];

module.exports = parts.tokens(function (
    myGabarito,

    attachReporter,
    loadFile
) {
    return Environment.descend(function (gabarito) {
        myGabarito.mark(this, gabarito);
        this.name = "Node.js";
    }).

    proto(attachReporter, parts.that(function (that, reporter) {
        events.forEach(function (e) {
            that[myGabarito].on(e, parts.args(function (args) {
                return reporter[e].apply(reporter, [that].concat(args));
            }));
        });
    })).

    proto(loadFile, function (file) {
        delete require.cache[require.resolve(file)];
        require(file);
    }).

    proto({
        dispatch: parts.that(function (that, files, reporters, done) {
            this[myGabarito].reset();

            reporters.forEach(function (r) { that[attachReporter](r); });
            files.forEach(this[loadFile]);

            reporters.forEach(function (r) { r.dispatch(that); });

            this[myGabarito].verify(function (results) {
                reporters.forEach(function (r) { r.done(that, results); });
                done(results);
            });
        })
    });

});
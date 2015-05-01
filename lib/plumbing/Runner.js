"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");

module.exports = ilk.tokens(function (
    environments,
    reporters,
    files,

    nextEnvironment,
    dispatch
) {

    return ilk(function () {
        environments.mark(this, []);
        reporters.mark(this, []);
        files.mark(this, []);
    }).

    proto(nextEnvironment, parts.that(function (that, done, results) {
        var env = this[environments].shift();
        if (env) {
            this[dispatch](env, function (result) {
                results.push({
                    environment: env,
                    results: result
                });
                that[nextEnvironment](done, results);
            });
        } else {
            done(results);
        }
    })).

    proto(dispatch, parts.that(function (that, env, done) {
        this[reporters].forEach(function (r) { r.dispatch(env); });
        env.dispatch(this[files], this[reporters], function (results) {
            that[reporters].forEach(function (r) { r.done(env, results); });
            done(results);
        });
    })).

    proto({
        addFile: function (file) {
            this[files].push(file);
        },

        addEnvironment: function (environment) {
            this[environments].push(environment);
        },

        addReporter: function (reporter) {
            this[reporters].push(reporter);
        },

        run: parts.that(function (that, done) {
            this[reporters].forEach(function (r) { r.start(); });

            this[nextEnvironment](function (results) {
                that[reporters].forEach(function (r) { r.finish(results); });
                done(results);
            }, []);
        })

    });
});

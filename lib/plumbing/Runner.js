"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");
var path = require("path");

module.exports = ilk.tokens(function (
    environments,
    reporters,
    files,

    nextEnvironment,
    dispatch
) {

    var sanitize = function (file) {
        var f = file.trim();
        return f.charAt(0) === "/"? f: path.join(process.cwd(), f);
    };

    /**
     * The gabarito runner. It needs the reporters in order to receive the
     * varius events issued by the environments. The environments in which the
     * test should run, and the files containing the tests themselves.
     *
     *
     * @class gabarito.plumbing.Runner
     * @constructor
     */
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

        /**
         * Adds a file within the runner
         *
         * @method addFile
         * @for gabarito.plumbing.Runner
         *
         * @param {string} file
         */
        addFile: function (file) {
            this[files].push(sanitize(file));
        },

        /**
         * Adds an environment within the runner
         *
         * @method addRunner
         * @for gabarito.plumbing.Runner
         *
         * @param {gabarito.plumbing.Environment} environment
         */
        addEnvironment: function (environment) {
            this[environments].push(environment);
        },

        /**
         * Adds a reporter within the runner
         *
         * @method addReporter
         * @for gabarito.plumbing.Runner
         *
         * @param {gabarito.plumbing.Reporter} reporter
         *
         */
        addReporter: function (reporter) {
            this[reporters].push(reporter);
        },

        /**
         * Dispatches the runner
         *
         * @method run
         * @for gabarito.plumbing.Runner
         *
         * @param {function} done The function that will be called when things
         *            have finished. It will receive the test results as first
         *            argument.
         */
        run: parts.that(function (that, done) {
            this[reporters].forEach(function (r) { r.start(); });

            this[nextEnvironment](function (results) {
                that[reporters].forEach(function (r) { r.finish(results); });
                done(results);
            }, []);
        })

    });
});

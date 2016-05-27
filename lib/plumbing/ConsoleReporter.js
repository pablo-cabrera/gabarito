"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");
var Reporter = require("./Reporter");

require("colors");

var ROW = (function (c, n) {
    var r = [];
    for (var i = 0; i < n; i += 1) {
        r.push(c);
    }

    return r.join("");
}("=", 80));

module.exports = ilk.tokens(function (
    startTime,
    initTime,
    console,

    formatEnv,
    log,
    testSummary,
    elapsed,
    row,
    formatError,
    getHighlightSentences
) {
    /**
     * The console reporter prints the gabarito events to the node's console
     * with colors and what-not.
     *
     * @class gabarito.plumbing.ConsoleReporter
     * @extends gabarito.plumbing.Reporter
     * @constructor
     *
     * @param {Console} [console]
     */
    return Reporter.descend(function (pConsole) {
        console.mark(this, pConsole || global.console);
        startTime.mark(this);
        initTime.mark(this);
    }).

    proto(formatEnv, function (env) {
        return "(" + env.getName().yellow + ")";
    }).

    proto(log, function (m) { this[console].log(m); }).

    proto(testSummary, function (results) {
        var summary = {
            failed: 0,
            passed: 0
        };

        parts.forEach(results.results, function (r) {
            if (r.error) {
                summary.failed += 1;
            } else {
                summary.passed += 1;
            }
        });

        return summary;
    }).

    proto(elapsed, function (t) { return (Date.now() - t) / 1000; }).

    proto(row, function (pass) {
        this[log](ROW[pass? "green": "red"].bold);
    }).

    proto(formatError, function (error, highlight) {
        var stack = error.stack;
        var msg;

        if (error instanceof Error) {
            msg = stack? stack: error.toString();
        } else {
            msg = parts.isFunction(error.toString)?
                    error.toString():
                    error.toString;

            if (msg === "[object Object]") {
                msg = error.message;
            }

            if (stack) {

                if (stack.indexOf(msg) === 0) {
                    msg = stack;
                } else {
                    msg += "\n" + stack;
                }
            }
        }

        highlight.forEach(function (h) {
            msg = msg.split(h).join(h.bold);
        });

        return msg;
    }).

    proto({

        /**
         * Prints a row saying that things are starting.
         *
         * @method start
         * @for gabarito.plumbing.ConsoleReporter
         */
        start: function () {
            this[log](ROW.bold);
            this[log]("Starting tests.");
            this[startTime] = Date.now();
        },

        /**
         * Prints a small summary when things have finished showing the test
         * results.
         *
         * @method finish
         * @for gabarito.plumbing.ConsoleReporter
         *
         * @param {object} results
         */
        finish: parts.that(function (that, results) {
            var failed = results.some(function (e) {
                return e.results.some(function (r) {
                    return parts.some(r.results, function (r) {
                        return Boolean(r.error);
                    });
                });
            });

            this[row](!failed);
            this[log]("Finished tests.");
            results.forEach(function (e) {
                var passed = 0;
                var failed = 0;

                e.results.forEach(function (r) {
                    var summary = that[testSummary](r);
                    passed += summary.passed;
                    failed += summary.failed;
                });

                that[log](that[formatEnv](e.environment) + " " +
                        "passed=" + (String(passed).green.bold) + " " +
                        "failed=" + (String(failed).red.bold));
            });

            this[log](("Elapsed time: " +
                    (String(this[elapsed](this[startTime])).bold) +
                    " seconds."));
            this[row](!failed);
            this[log]("");
        }),

        /**
         * Prints a row stating that that n tests will be verified.
         *
         *  @method init
         *  @for gabarito.plumbing.ConsoleReporter
         *
         *  @param {gabarito.plumbing.Environment} env
         *  @param {string[]} tests
         */
        init: function (env, tests) {
            var l = tests.length;
            var msg = this[formatEnv](env) + " " +
                    "verifying " + (String(l).green.bold) + " " +
                    (l === 1? "test.": "tests.");

            this[initTime] = Date.now();

            this[log](ROW.yellow.bold);
            this[log](msg);
        },

        /**
         * Prints a row stating which test is about to be verified.
         *
         * @method begin
         * @for gabarito.plumbing.ConsoleReporter
         *
         * @param {gabarito.plumbing.Environment} env
         * @param {string} test
         */
        begin: function (env, test) {
            var msg = this[formatEnv](env) + " " +
                    "verifying " + (test.bold) + ".";

            this[log](ROW.bold);
            this[log](msg);
        },

        /**
         * Prints a small summary for the test that has ended.
         *
         * @method end
         * @for gabarito.plumbing.ConsoleReporter
         *
         * @param {gabarito.plumbing.Environment} env
         * @param {string} test
         * @param {object} results
         */
        end: function (env, test, results) {
            var summary = this[testSummary](results);

            var msg = this[formatEnv](env) + " " +
                    "test summary: " +
                    ("passed: " + summary.passed).bold.green +
                    " " +
                    ("failed: " + summary.failed).bold.red;

            this[row](summary.failed === 0);
            this[log](msg);
            this[row](summary.failed === 0);
            this[log]("");
        },

        /**
         * Prints a summary for the environment when it has completed.
         *
         * @method complete
         * @for gabarito.plumbing.ConsoleReporter
         *
         * @param {gabarito.plumbing.Environment} env
         * @param {object[]} results
         */
        complete: parts.that(function (that, env, results) {
            var tests = results.length;
            var summary = {
                passed: 0,
                failed: 0
            };

            results.forEach(function (r) {
                var s = that[testSummary](r);
                summary.passed += s.passed;
                summary.failed += s.failed;
            });

            this[row](summary.failed === 0);
            this[log]("Environment summary: " + (env.getName().yellow.bold));
            this[log]("Tests: " + (String(tests).bold));
            this[log](("Passed clauses: " +
                    (String(summary.passed).bold)).green);
            this[log](("Failed clauses: " + (String(summary.failed).bold)).red);
            this[log](("Elapsed time: " +
                    (String((Date.now() - this[initTime]) / 1000).bold) +
                    " seconds."));
            this[row](summary.failed === 0);
            this[log]("");
        }),

        /**
         * Prints a green line stating that the test clause has passed
         *
         * @method pass
         * @for gabarito.plumbing.ConsoleReporter
         *
         * @param {gabarito.plumbing.Environment} env
         * @param {string} test
         * @param {string} clause
         * @param {object} result
         */
        pass: function (env, test, clause, result) {
            var msg = this[formatEnv](env) + " " +
                    (("[" + "PASS".green + "] ").bold) + test + " :: " + clause;
            this[log](msg);
        },

        /**
         * Prints a red line stating that the test clause has failed.
         *
         * @method fail
         * @for gabarito.plumbing.ConsoleReporter
         *
         * @param {gabarito.plumbing.Environment} env
         * @param {string} test
         * @param {string} clause
         * @param {object} result
         */
        fail: function (env, test, clause, result) {
            var msg = this[formatEnv](env) + " " +
                    (("[" + "FAIL".red + "] ").bold) + test + " :: " +
                    clause;
            this[log](msg);
            this[log](this[formatError](result.error,
                    test.split(/[\.\\\/\s]/).concat([clause])).red);
        },

        /**
         * Prints the environment's name and every argument on a new line.
         *
         * @method say
         * @for gabarito.plumbing.ConsoleReporter
         *
         * @param {gabarito.plumbing.Environment} env
         * @param {string...} args
         */

        say: parts.args(parts.that(function (that, args) {
            var env = args.shift();

            this[log](this[formatEnv](env) + " says...");
            args.forEach(function (m) { that[log](m); });
        }))
    });
});

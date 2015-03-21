"use strict";

var parts = require("parts");
var Reporter = require("./Reporter");

require("colors");

var ROW = (function (c, n) {
    var r = [];
    for (var i = 0; i < n; i += 1) {
        r.push(c);
    }

    return r.join("");
}("=", 80));

module.exports = parts.tokens(function (
    startTime,
    initTime,

    formatEnv,
    log,
    testSummary,
    elapsed,
    row
) {
    return Reporter.descend(function () {
        startTime.mark(this);
        initTime.mark(this);
    }).

    proto(formatEnv, function (env) { return "(" + env.name.yellow + ")"; }).

    proto(log, function (m) { console.log(m); }).

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

    proto({
        start: function () {
            this[log](row.bold);
            this[log]("Starting tests.");
            this[startTime] = Date.now();
        },

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
                        "passed=" + (String(passed).green.bold)+ " " +
                        "failed=" + (String(failed).red.bold));
            });

            this[log](("Elapsed time: " +
                    (String(this[elapsed](this[startTime])).bold) + " seconds."));

        }),

        init: function (env, tests) {
            var l = tests.length;
            var msg = this[formatEnv](env) + " " +
                    "verifying " + (String(l).green.bold) + " " +
                    (l === 1? "test.": "tests.");

            this[initTime] = Date.now();

            this[log](msg);
        },

        begin: function (env, test) {
            var msg = this[formatEnv](env) + " " +
                    "verifying " + (test.name.bold) + ".";

            this[log](ROW.bold);
            this[log](msg);
        },

        end: function (env, results) {
            var summary = this[testSummary](results);

            var msg = this[formatEnv](env) + " " +
                    "test summary: " +
                    ("passed: " + summary.passed).bold.green +
                    " " +
                    ("failed: " + summary.failed).bold.red;

            this[row](summary.failed === 0);
            this[log](msg);
        },

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
            this[log]("Environment summary: " + (env.name.yellow.bold));
            this[log]("Tests: " + (String(tests).bold));
            this[log](("Passed: " + (String(summary.passed).bold)).green);
            this[log](("Failed: " + (String(summary.failed).bold)).red);
            this[log](("Elapsed time: " +
                    (String((Date.now() - this[initTime]) / 1000).bold) + " seconds."));

            this._beginTime = undefined;
        }),

        pass: function (env, test, clause, result) {
            var msg = this[formatEnv](env) + " " +
                    (("[" + "PASS".green + "] ").bold) + test.name + " :: " + clause;
            this[log](msg);
        },

        fail: function (env, test, clause, result) {
            var msg = this[formatEnv](env) + " " +
                    (("[" + "FAIL".red + "] ").bold) + test.name + " :: " + clause;
            this[log](msg);

            var error = result.error;
            var stack = error.stack;
            this[log]((stack? stack: error.toString).red);
        },

        dispatch: function (env) {
            var msg = this[formatEnv](env) + " dispatched!";
            this[log](msg);
        },

        done: function (env, results) {
            var s = results.length;
            var d = 0;
            results.forEach(function (r) { d += Object.keys(r.results).length; });

            var msg = this[formatEnv](env) + " " +
                    (String(s).green.bold) + " " +
                    (s === 1? "sketch": "sketches") + " and " +
                    (String(d).green.bold) + " " +
                    (d === 1? "draft": "drafts");
            this[log](msg);
        }

    });
});
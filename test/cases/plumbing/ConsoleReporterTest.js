"use strict";

var gabarito = require("../../../lib/gabarito");
var parts = require("../../../deps/parts");

var ConsoleReporter = require("../../../lib/plumbing/ConsoleReporter");
var Environment = require("../../../lib/plumbing/Environment");

var assert = gabarito.assert;
var spy = gabarito.spy;
var matcher = gabarito.matcher;

var reporter;
var log;

require("colors");

var ROW = (function (c, n) {
    var r = [];
    for (var i = 0; i < n; i += 1) {
        r.push(c);
    }

    return r.join("");
}("=", 80));

var envName = "(" + ("dummy".yellow) + ")";

var DummyEnvironment = Environment.descend().
proto({
    getName: parts.constant("dummy")
});

var env;

gabarito.test("gabarito.plumbing.ConsoleReporterTest").

before(function () {
    env = new DummyEnvironment();
    log = spy();
    reporter = new ConsoleReporter(false, { log: log }, parts.constant(0));
}).

clause("start should print a row saying that things are starting", function () {
    reporter.start();

    log.verify().args(ROW.bold);
    log.verify().args("Starting tests.");
    log.noCalls();
}).

clause(
"finish should print a small summary when things have finished showing the " +
"test results, with green rows because no test has failed",
function () {

    reporter.start();
    log.reset();

    var result = {
        environment: env,
        results: [
            {
                test: "test",
                start: parts.now(),
                end: parts.now(),
                results: {
                    "clause": {
                        start: parts.now(),
                        elapsedTime: 1
                    }
                }
            }
        ]
    };

    reporter.finish([result]);

    log.verify().args(ROW.green.bold);
    log.verify().args("Finished tests.");
    log.verify().args(
        envName + " " +
        "passed=" + ("1".green.bold) + " " +
        "failed=" + ("0".red.bold));

    log.verify().args("Elapsed time: " + (("0").bold) + " seconds.");
    log.verify().args(ROW.green.bold);
    log.verify().args("");
    log.noCalls();
}).

clause(
"finish should print a small summary when things have finished showing the " +
"test results, with red rows because some test has failed", function () {

    reporter.start();
    log.reset();

    var result = {
        environment: env,
        results: [
            {
                test: "test",
                start: parts.now(),
                end: parts.now(),
                results: {
                    "clause": {
                        start: parts.now(),
                        elapsedTime: 1,
                        error: new Error()
                    }
                }
            }
        ]
    };

    reporter.finish([result]);

    log.verify().args(ROW.red.bold);
    log.verify().args("Finished tests.");
    log.verify().args(
        envName + " " +
        "passed=" + ("0".green.bold) + " " +
        "failed=" + ("1".red.bold));

    log.verify().args("Elapsed time: " + (("0").bold) + " seconds.");
    log.verify().args(ROW.red.bold);
    log.verify().args("");
    log.noCalls();
}).

clause("init should print a row stating that that 1 test will be verified",
function () {
    reporter.init(env, ["test"]);
    log.verify().args(ROW.yellow.bold);
    log.verify(envName + " verifying" + ("1".green.bold) + " test.");
    log.noCalls();
}).

clause("init should print a row stating that that 2 tests will be verified",
function () {
    reporter.init(env, ["test", "test"]);
    log.verify().args(ROW.yellow.bold);
    log.verify(envName + " verifying" + ("2".green.bold) + " tests.");
    log.noCalls();
}).

clause("begin should print a row stating which test is about to be verified",
function () {
    reporter.begin(env, "test");
    log.verify().args(ROW.bold);
    log.verify().args(envName + " verifying " + ("test".bold) + ".");
    log.noCalls();
}).

clause(
"end should print a small summary for the test that has ended, with green " +
"rows because no test have failed",
function () {
    reporter.end(env, "test", {
        results: {
            "clause": {
                start: parts.now(),
                elapsedTime: 1
            }
        }
    });

    log.verify().args(ROW.green.bold);
    log.verify().args(envName + " test summary: " +
                    ("passed: " + 1).bold.green +
                    " " +
                    ("failed: " + 0).bold.red);
    log.verify().args(ROW.green.bold);
}).

clause(
"end should print a small summary for the test that has ended, with red " +
"rows because a test have failed",
function () {
    reporter.end(env, "test", {
        results: {
            "clause": {
                start: parts.now(),
                elapsedTime: 1,
                error: new Error()
            }
        }
    });

    log.verify().args(ROW.red.bold);
    log.verify().args(envName + " test summary: " +
                    ("passed: " + 0).bold.green +
                    " " +
                    ("failed: " + 1).bold.red);
    log.verify().args(ROW.red.bold);
}).

clause(
"complete should print a summary for the environment when it has completed, " +
"with green rows because no test have failed",
function () {
    reporter.init(env, ["test"]);
    log.reset();

    var result = {
        results: {
            "clause": {
                start: parts.now(),
                elapsedTime: 1
            }
        }
    };

    reporter.complete(env, [result]);

    log.verify().args(ROW.green.bold);
    log.verify().args("Environment summary: " + (env.getName().yellow.bold));
    log.verify().args("Tests: " + ("1".bold));
    log.verify().args(("Passed clauses: " + ("1".bold)).green);
    log.verify().args(("Failed clauses: " + ("0".bold)).red);
    log.verify().args(("Elapsed time: " + ("0".bold) + " seconds."));
    log.verify().args(ROW.green.bold);
    log.verify().args("");
}).

clause(
"complete should print a summary for the environment when it has completed, " +
"with red rows because a test have failed",
function () {
    reporter.init(env, ["test"]);
    log.reset();

    var result = {
        results: {
            "clause": {
                start: parts.now(),
                elapsedTime: 1,
                error: new Error()
            }
        }
    };

    reporter.complete(env, [result]);

    log.verify().args(ROW.red.bold);
    log.verify().args("Environment summary: " + (env.getName().yellow.bold));
    log.verify().args("Tests: " + ("1".bold));
    log.verify().args(("Passed clauses: " + ("0".bold)).green);
    log.verify().args(("Failed clauses: " + ("1".bold)).red);
    log.verify().args(("Elapsed time: " + ("0".bold) + " seconds."));
    log.verify().args(ROW.red.bold);
    log.verify().args("");
}).

clause(
"pass should print a green line stating that the test clause has passed",
function () {
    var result = {
        start: 0,
        elapsedTime: 0
    };

    reporter.pass(env, "test", "clause", result);

    log.verify().args(envName + " " + (("[" + "PASS".green + "] ").bold) +
            "test :: clause");

    log.noCalls();
}).

clause("fail should print a red line stating that the test clause has failed",
function () {
    var result = {
        start: 0,
        elapsedTime: 0,
        error: new Error("error")
    };

    reporter.fail(env, "test", "clause", result);

    log.verify().args(envName + " " + (("[" + "FAIL".red + "] ").bold) +
            "test :: clause");
    log.verify().args(Error.prototype.toString.call(result.error).red);
    log.noCalls();
}).

clause(
"fail should print a red line stating that the test clause has failed and " +
"the stacktrace below",
function () {
    reporter = new ConsoleReporter(true, { log: log }, parts.constant(0));


    var result = {
        start: 0,
        elapsedTime: 0,
        error: new Error("error")
    };

    reporter.fail(env, "test", "clause", result);

    log.verify().args(envName + " " + (("[" + "FAIL".red + "] ").bold) +
            "test :: clause");
    log.verify().args(
            (Error.prototype.toString.call(result.error) + "\n" +
            "Stack trace:\n" +
            result.error.stack).red);

    log.noCalls();
}).

clause(
"say should print the environment's name and every argument on a new line",
function () {
    reporter.say(env, "some crap", "some other crap", "some shit");

    log.verify().args(envName + " says...");
    log.verify().args("some crap");
    log.verify().args("some other crap");
    log.verify().args("some shit");
    log.noCalls();
});

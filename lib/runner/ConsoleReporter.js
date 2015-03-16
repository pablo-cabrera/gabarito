"use strict";

var util = require("util");
var Reporter = require("./Reporter");

require("colors");

var ConsoleReporter = function () {
    this._beginTime = undefined;
};

util.inherits(ConsoleReporter, Reporter);

var formatEnv = function (env) {
    return "(" + env.name.yellow + ")";
};

ConsoleReporter.prototype.begin = function (env, sketches) {
    var l = sketches.length;

    var msg = formatEnv(env) + " " +
            "verifying " + l + " " + (l === 1? "sketch.": "sketches.");

    console.log(msg.bold);
    this._beginTime = Date.now();
};

var row = function (c, n) {
    var r = [];
    for (var i = 0; i < n; i += 1) {
        r.push(c);
    }

    return r.join("");
};

ConsoleReporter.prototype.end = function (env, results) {
    var r = row("=", 80);
    var s = results.length;
    var p = 0;
    var f = 0;
    results.forEach(function (r) {
        Object.keys(r.results).forEach(function (k) {
            if (r.results[k].error) {
                f += 1;
            } else {
                p += 1;
            }
        });
    });

    console.log(r.bold);
    console.log("Final summary:".bold);
    console.log(("Environment: " + (env.name.yellow)).bold);
    console.log(("Sketches: " + s).bold);
    console.log((("Passed: " + String(p).green).bold));
    console.log((("Failed: " + String(f).red).bold));
    console.log(("Elapsed time: " +
            ((Date.now() - this._beginTime) / 1000) + " seconds.").bold);
    console.log(r.bold);

    this._beginTime = undefined;
};

ConsoleReporter.prototype.pass = function (env, sketch, draft, result) {
    var msg = formatEnv(env) + " " +
            "[" + "PASS".green + "] " + sketch.name + " :: " + draft;
    console.log(msg.bold);
};

ConsoleReporter.prototype.fail = function (env, sketch, draft, result) {
    var msg = formatEnv(env) + " " +
            "[" + "FAIL".red + "] " + sketch.name + " :: " + draft;
    console.log(msg.bold);

    var error = result.error;
    var stack = error.stack;
    console.log((stack? stack: error.toString).red.bold);
};

ConsoleReporter.prototype.dispatch = function (env) {
    var msg = formatEnv(env) + " dispatched!";
    console.log(msg.bold);
};

ConsoleReporter.prototype.done = function (env, results) {
    var s = results.length;
    var d = 0;
    results.forEach(function (r) { d += Object.keys(r.results).length; });

    var msg = formatEnv(env) + " " +
            (String(s).green) + " " +
            (s === 1? "sketch": "sketches") + " and " +
            (String(d).green) + " " +
            (s === 1? "draft": "drafts");
    console.log(msg.bold);
};

module.exports = ConsoleReporter;
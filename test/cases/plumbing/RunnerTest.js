"use strict";

var path = require("path");

var cwd = process.cwd();
var root = cwd + "/test/coverage/instrument";
if (!require("fs").existsSync(root)) {
    root = cwd;
}

var gabarito = require("../../../lib/gabarito");
var parts = require("../../../deps/parts");

var Runner = require(root + "/lib/plumbing/Runner");

var assert = gabarito.assert;
var spy = gabarito.spy;
var matcher = gabarito.matcher;

gabarito.test("gabarito.plumbing.RunnerTest").

clause(
"runner should tell each reporter that it has started, " +
"dispatch each environment sequentially " +
"passing the files and the reportes in the same order that they were added, " +
"telling the reporter which environment is being dispatched, " +
"collect the results for the callback, " +
"tell the reporters that things have finished for each environment, " +
"tell the reporters that things have finished " +
"and call the callback passing the results",
function () {
    var env1 = {
        results: {},
        dispatch: spy(function (files, reporters, done) { done(env1.results); })
    };

    var env2 = {
        results: {},
        dispatch: spy(function (files, reporters, done) { done(env2.results); })
    };

    var reporter1 = {
        dispatch: spy(),
        done: spy(),
        start: spy(),
        finish: spy()
    };

    var reporter2 = {
        dispatch: spy(),
        done: spy(),
        start: spy(),
        finish: spy()
    };

    var done = spy();

    var runner = new Runner();

    runner.addFile("a");
    runner.addFile("b");

    runner.addReporter(reporter1);
    runner.addReporter(reporter2);

    runner.addEnvironment(env1);
    runner.addEnvironment(env2);

    runner.run(done);

    var files = [
        path.join(process.cwd(), "a"),
        path.join(process.cwd(), "b")
    ];

    var reporters = [reporter1, reporter2];
    var results = [
        {
            environment: env1,
            results: env1.results},
        {
            environment: env2,
            results: env2.results }];

    var reporter1Start = reporter1.start.verify();
    var reporter2Start = reporter2.start.verify();
    var reporter1DispatchEnv1 = reporter1.dispatch.verify();
    var reporter2DispatchEnv1 = reporter2.dispatch.verify();
    var env1Dispatch = env1.dispatch.verify();
    var reporter1DoneEnv1 = reporter1.done.verify();
    var reporter2DoneEnv1 = reporter2.done.verify();
    var reporter1DispatchEnv2 = reporter1.dispatch.verify();
    var reporter2DispatchEnv2 = reporter2.dispatch.verify();
    var env2Dispatch = env2.dispatch.verify();
    var reporter1DoneEnv2 = reporter1.done.verify();
    var reporter2DoneEnv2 = reporter2.done.verify();
    var reporter1Finish = reporter1.finish.verify();
    var reporter2Finish = reporter2.finish.verify();
    var doneCall = done.verify();


    reporter1Start.args().before(reporter2Start);
    reporter2Start.args().before(reporter1DispatchEnv1);
    reporter1DispatchEnv1.args(env1).before(reporter2DispatchEnv1);
    reporter2DispatchEnv1.args(env1).before(env1Dispatch);
    env1Dispatch.args(files, reporters, matcher.FUNCTION).
        before(reporter1DoneEnv1);
    reporter1DoneEnv1.args(env1, env1.results).before(reporter2DoneEnv1);
    reporter2DoneEnv1.args(env1, env1.results).before(reporter1DispatchEnv2);
    reporter1DispatchEnv2.args(env2).before(reporter2DispatchEnv2);
    reporter2DispatchEnv2.args(env2).before(env2Dispatch);
    env2Dispatch.args(files, reporters, matcher.FUNCTION).
        before(reporter1DoneEnv2);
    reporter1DoneEnv2.args(env2, env2.results).before(reporter2DoneEnv2);
    reporter2DoneEnv2.args(env2, env2.results).before(reporter1Finish);
    reporter1Finish.args(results).before(reporter2Finish);
    reporter2Finish.args(results).before(doneCall);
    doneCall.args(results);

});

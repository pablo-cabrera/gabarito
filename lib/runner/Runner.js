"use strict";

var Runner = function () {

    var environments = [];
    var reporters = [];
    var files = [];

    var nextEnvironment = function (done, results) {
        var env = environments.shift();
        if (env) {
            dispatch(env, function (result) {
                results.push({
                    environment: env,
                    results: result
                });
                nextEnvironment(done, results);
            });
        } else {
            done(results);
        }
    };

    var dispatch = function (env, done) {
        env.dispatch(files, reporters, done);
    };

    this.addFile = function (file) {
        files.push(file);
    };

    this.addEnvironment = function (environment) {
        environments.push(environment);
    };

    this.addReporter = function (reporter) {
        reporters.push(reporter);
    };

    this.run = function (done) {
        nextEnvironment(done, []);
    };

};

module.exports = Runner;
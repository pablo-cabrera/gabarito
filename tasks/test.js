module.exports = function(grunt) {
    "use strict";

    var cwd = process.cwd();

    var root = cwd + "/cover";

    var Runner = require(root + "/runner/Runner");
    var NodeEnvironment = require(root + "/runner/NodeEnvironment");
    var ConsoleReporter = require(root + "/runner/ConsoleReporter");

    grunt.registerMultiTask("test", "gabarito test runner", function() {

        var done = this.async();

        var runner = new Runner();

        runner.addFile(cwd + "/test/gabarito-test.js");
        runner.addEnvironment(new NodeEnvironment());
        runner.addReporter(new ConsoleReporter());
        runner.run(function (results) {
            done();
        });
    });

};

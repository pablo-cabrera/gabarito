"use strict";
var cwd = process.cwd();
var root = cwd + "/lib";

var path = require("path");
var parts = require(cwd + "/deps/parts");

try {
    require(root + "/gabarito");
} catch (e) {
    console.log(e);
}

var gabarito = require(root + "/gabarito");
var plumbing = gabarito.plumbing;

module.exports = function (grunt) {
    var setupFiles = function (runner, files) {
        files.forEach(function (f) {
            f.src.forEach(function (f) {
                if (f.indexOf("/") !== 0) {
                    f = path.join(cwd, f);
                }

                runner.addFile(f);
            });
        });
    };

    var setupEnvironments = function (runner, environments) {
        if (environments.indexOf("node") > -1) {
            var node = new plumbing.NodeEnvironment();
            runner.addEnvironment(node);
        }

        if (environments.indexOf("phantom") > -1) {
            var phantom = new plumbing.PhantomEnvironment();
            runner.addEnvironment(phantom);
        }
    };

    var setupReporters = function (runner, jUnitFile) {
        runner.addReporter(new plumbing.ConsoleReporter());

        var jUnitReporter = new plumbing.JUnitXmlReporter(jUnitFile);
        runner.addReporter(jUnitReporter);

    };

    grunt.registerMultiTask("test", "gabarito test runner", function () {
        var done = this.async();
        var runner = new plumbing.Runner();

        grunt.option.init();


        grunt.file.mkdir(path.join(cwd, "/test/result"));

        setupFiles(runner, this.files);
        setupEnvironments(runner, this.options().environments);
        setupReporters(runner, this.options().results);

        runner.run(function (results) {
            var hasErrors = results.some(function (r) {
                return r.results.some(function (r) {
                    return parts.some(r.results, function (r, i) {
                        return parts.hop(r, "error");
                    });
                });
            });

            done(!hasErrors);
        });

    });

};

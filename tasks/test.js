module.exports = function(grunt) {
    "use strict";

    var cwd = process.cwd();

    var root = cwd + "/lib";

    var parts = require("parts");
    var path = require("path");

    var gabarito = require(root + "/gabarito");

    grunt.registerMultiTask("test", "gabarito test runner", function() {

        var done = this.async();
        var runner = new gabarito.runner.Runner();
        var cwd = process.cwd();

        this.files.forEach(function (f) {
            f.src.forEach(function (f) {
                if (f.indexOf("/") !== 0) {
                    f = path.join(cwd, f);
                }
                runner.addFile(f);
            });
        });

        runner.addEnvironment(new gabarito.runner.NodeEnvironment(gabarito));
        runner.addReporter(new gabarito.runner.ConsoleReporter());
        runner.addReporter(new gabarito.runner.JUnitXmlReporter(path.join(cwd, "/test/result/results.xml")));
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

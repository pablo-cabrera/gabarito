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

        grunt.file.mkdir(path.join(cwd, "/test/result"));

        var nodeEnv = new gabarito.runner.NodeEnvironment(gabarito);
        runner.addEnvironment(nodeEnv);

        var seleniumEnv = new gabarito.runner.SeleniumEnvironment("firefox",
                "http://localhost:4444/wd/hub")
        runner.addEnvironment(seleniumEnv);

        var seleniumEnv2 = new gabarito.runner.SeleniumEnvironment("chrome",
                "http://localhost:4444/wd/hub")
        runner.addEnvironment(seleniumEnv2);


        var consoleReporter = new gabarito.runner.ConsoleReporter();
        runner.addReporter(consoleReporter);

        var jUnitReporter = new gabarito.runner.JUnitXmlReporter(
                path.join(cwd, "/test/result/results.xml"));
        runner.addReporter(jUnitReporter);

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

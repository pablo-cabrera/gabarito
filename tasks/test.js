module.exports = function(grunt) {
    "use strict";

    var cwd = process.cwd();

    var root = cwd + "/lib";

    var parts = require("parts");
    var path = require("path");

    var gabarito = require(root + "/gabarito");

    var createSeleniumEnv = function (browser) {
        return new gabarito.runner.SeleniumEnvironment(browser,
            "http://localhost:4444/wd/hub",
            "20.0.0.103");
//            "192.168.0.165");
    };

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

        var firefoxSeleniumEnv = createSeleniumEnv("firefox");
        var chromeSeleniumEnv = createSeleniumEnv("chrome");
        var ieSeleniumEnv = createSeleniumEnv("internet explorer");

//        runner.addEnvironment(firefoxSeleniumEnv);
//        runner.addEnvironment(chromeSeleniumEnv);
        runner.addEnvironment(ieSeleniumEnv);

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

"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");
var Reporter = require("./Reporter");


module.exports = ilk.tokens(function (
    file,
    name,
    xmlbuilder,
    fs,
    nowGiver,
    start,


    buildTestSuites,
    buildTestSuite,
    buildTestCases
) {

    /**
     * The JUnitXmlReporter produces a XML file with the test results that has
     * the jUnit format. Useful to use along with your favorite CI solution.
     *
     * @class gabarito.plumbing.JUnitXmlReporter
     * @extends gabarito.plumbing.Reporter
     * @constructor
     *
     * @param {string} file The file to write the xml itself
     * @param {string} name The name of the jUnit report
     * @param {XmlBuilder} [xmlbuilder]
     * @param {FileSystem} [fs]
     * @param {function} [nowGiver]
     */
    return Reporter.descend(function (pFile, pName, pXmlBuilder, pFs,
            pNowGiver) {

        file.mark(this, pFile);
        name.mark(this, pName);
        xmlbuilder.mark(this, pXmlBuilder || require("xmlbuilder"));
        fs.mark(this, pFs || require("fs"));
        nowGiver.mark(this, pNowGiver || Date.now);
    }).

    proto(buildTestSuites, parts.that(function (that, results) {
        var testsuites = this[xmlbuilder].create("testsuites");

        if (this[name]) {
            testsuites.att("name", this[name]);
        }

        var tests = 0;
        var failures = 0;

        testsuites.att("time", (this[nowGiver]() - this[start]) / 1000);
        results.forEach(function (results) {
            that[buildTestSuite](testsuites, results);

            results.results.forEach(function (r) {
                parts.forEach(r.results, function (r) {
                    tests += 1;
                    if (r.error) {
                        failures += 1;
                    }
                });
            });
        });

        testsuites.att("tests", tests);
        testsuites.att("failures", failures);

        return testsuites;
    })).

    proto(buildTestSuite, parts.that(function (that, testSuites, results) {
        var env = results.environment.getName();
        var testSuite = testSuites.ele("testsuite");
        testSuite.att("name", env);

        var tests = 0;
        var failures = 0;
        var time = 0;

        results.results.forEach(function (r) {
            that[buildTestCases](env, testSuite, r);

            time += (r.end - r.start);

            parts.forEach(r.results, function (r) {
                tests += 1;
                if (r.error) {
                    failures += 1;
                }
            });
        });

        testSuite.att("tests", tests);
        testSuite.att("failures", failures);
        testSuite.att("time", time / 1000);
    })).

    proto(buildTestCases, parts.that(function (that, env, testSuite, results) {
        parts.forEach(results.results, function (r, p) {
            var testCase = testSuite.ele("testcase");
            testCase.att(
                    "name",
                    "(" + env + ") " + results.test + "#" + p);
            testCase.att("time", r.elapsedTime / 1000);
            testCase.att("classname", results.test);

            if (r.error) {
                var failure = testCase.ele("failure");
                failure.att("message", r.error.message);

                if (r.error.stack) {
                    var systemErr = testCase.ele("system-err");
                    systemErr.txt(r.error.stack);
                }
            }
        });
    })).

    proto({
        start: function () {
            this[start] = this[nowGiver]();
        },

        /**
         * Produces the XML itself
         *
         * @method finish
         * @for gabarito.plumbing.JUnitXmlReporter
         *
         * @param {gabarito.EnvironmentResults[]} results
         */
        finish: function (results) {
            var testsuites = this[buildTestSuites](results);
            this[fs].writeFileSync(
                    this[file],
                    testsuites.end({ pretty: true }));
        }
    });
});

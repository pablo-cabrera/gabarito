module.exports = function (grunt) {
    "use strict";

    var lintFiles = [
        "Gruntfile.js",
        "tasks/test.js",
        "lib/**/*.js",
        "test/cases/**/*.js"
    ];

    grunt.option("stack", true);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        test: {
            runtime: {
                src: [
                    "test/cases/AssertTest.js",
                    "test/cases/AssertThatTest.js",
                    "test/cases/GabaritoTest.js",
                    "test/cases/SpyTest.js",
                    "test/cases/TestBuilderTest.js"
                ],

                options: {
                    results: "test/result/runtime.xml",
                    environments: ["node", "phantom"]
                }
            },

            plumbing: {
                src: ["test/cases/plumbing/**/*.js"],

                options: {
                    results: "test/result/plumbing.xml",
                    environments: ["node"]
                }
            },

            runtimeWithCoverage: {
                src: [
                    "test/coverage/instrument/deps/json2.js",
                    "test/coverage/instrument/deps/parts.js",
                    "test/coverage/instrument/deps/ilk.js",
                    "test/coverage/instrument/lib/gabarito.js",
                    "test/cases/setup-coverage.js",
                    "test/cases/AssertTest.js",
                    "test/cases/AssertThatTest.js",
                    "test/cases/GabaritoTest.js",
                    "test/cases/SpyTest.js",
                    "test/cases/TestBuilderTest.js"
                ],

                options: {
                    results: "test/result/runtime.xml",
                    environments: ["node", "phantom"]
                }
            },

            plumbingWithCoverage: {
                src: [
                    "test/cases/setup-coverage.js",
                    "test/cases/plumbing/**/*.js"],

                options: {
                    results: "test/result/plumbing.xml",
                    environments: ["node"]
                }
            }

        },

        jshint: {
            options: {
                /* enforcing */
                strict: true,
                bitwise: false,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                plusplus: true,
                quotmark: "double",

                undef: true,

                /* relaxing */
                eqnull: true,
                sub: true,

                /* environment */
                node: true,
                browser: true,
                globals: {
                    JSON: true
                }
            },

            files: lintFiles
        },

        jscs: {
            src: lintFiles,
            options: {
                config: ".jscsrc"
            }
        },

        yuidoc: {
            compile: {
                name: "<%= pkg.name %>",
                description: "<%= pkg.description %>",
                version: "<%= pkg.version %>",
                url: "<%= pkg.homepage %>",
                options: {
                    themedir: "yuidoc-clear-theme",
                    paths: ["lib/", "yuidoc-extras/"],
                    outdir: "docs/"
                }
            }
        },

        clean: {
            coverage: ["test/coverage"]
        },

        instrument: {
            files: "lib/**/*.js",
            options: {
                lazy: true,
                basePath: "test/coverage/instrument/"
            }
        },

        makeReport: {
            src: "test/coverage/reports/**/*.json",
            options: {
                type: "lcov",
                dir: "test/coverage/reports",
                print: "detail"
            }
        },

        copy: {
            instrument: {
                expand: true,
                cwd: "deps/",
                src: ["**"],
                dest: "test/coverage/instrument/deps/"
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-istanbul");

    // Local tasks
    grunt.loadTasks("tasks");

    grunt.registerTask("lint", ["jscs", "jshint"]);
    grunt.registerTask("dev", ["lint", "test:runtime", "test:plumbing"]);

    grunt.registerTask("default", ["dev", "yuidoc"]);

    grunt.registerTask("coverage", [
        "clean:coverage",
        "instrument",
        "copy:instrument",
        "test:runtimeWithCoverage",
        "test:plumbingWithCoverage",
        "makeReport"
    ]);


};

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
                    themedir: "node_modules/yuidoc-lucid-theme/",
                    paths: "lib/",
                    outdir: "docs/",
                    helpers: ["node_modules/" +
                            "yuidoc-lucid-theme/helpers/helpers.js"]
                }
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-jscs");

    // Local tasks
    grunt.loadTasks("tasks");

    grunt.registerTask("default",
            ["jscs", "jshint", "test:runtime", "test:plumbing", "yuidoc"]);

};

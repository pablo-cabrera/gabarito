"use strict";

var root = "../..";
var ilk = require(root + "/deps/ilk");

/**
 * The reporter class that describes all the events issued by the environment
 * while running the tests.
 *
 * A reporter may implement any method described here, the default
 * implementation does nothing.
 *
 * @class gabarito.plumbing.Reporter
 * @constructor
 */
module.exports = ilk().
proto({

    /**
     * Issued when the runner starts
     *
     * @method start
     * @for gabarito.plumbing.Reporter
     */
    start: function () {},

    /**
     * Issued when the runner finishes
     *
     * @method finish
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.EnvironmentResults[]} results
     */
    finish: function (results) {},

    /**
     * Issued when an environment has initialized
     *
     * @method init
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment that has
     *            initialized
     * @param {string[]} tests The test names that will run
     */
    init: function (env, tests) {},

    /**
     * Issued when an environment has completed
     *
     * @method complete
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment that has
     *            completed
     * @param {gabarito.TestResult[]} results The environment's results
     */
    complete: function (env, results) {},

    /**
     * Issued when a test is about to begin
     *
     * @method begin
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment running the
     *            tests
     * @param {string} test The test name
     */
    begin: function (env, test) {},

    /**
     * Issued when a test has ended
     *
     * @method end
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment running the
     *            tests
     * @param {gabarito.TestResult} results The results for the test
     */
    end: function (env, test, results) {},

    /**
     * Issued when a test clause is about to be run
     *
     * @method enter
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment running the
     *            tests
     * @param {string} test The test name
     * @param {string} clause The test clause
     */
    enter: function (env, test, clause) {},

    /**
     * Issued when a test clause passes
     *
     * @method pass
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment running the
     *            tests
     * @param {string} test The test name
     * @param {string} clause The test clause
     * @param {gabarito.ClauseResult} result The clause result
     */
    pass: function (env, test, clause, result) {},

    /**
     * Issued when a test clause fail
     *
     * @method fail
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment running the
     *            tests
     * @param {string} test The test name
     * @param {string} clause The test clause
     * @param {gabarito.ClauseResult} result The clause result
     */
    fail: function (env, test, clause, result) {},

    /**
     * Issued when an environment is dispatched
     *
     * @method dispatch
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment
     */
    dispatch: function (env) {},

    /**
     * Issued when an environment finishes
     *
     * @method done
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment
     * @param {gabarito.EnvironmentResult} results The results for the
     *            environment
     */
    done: function (env, results) {},

    /**
     * Issued when an environment says something
     *
     * @method say
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment
     * @param {string} args*
     */
    say: function (env) {},

    /**
     * Issued when an error outside a given clause happens
     *
     * @method error
     * @for gabarito.plumbing.Reporter
     *
     * @param {gabarito.plumbing.Environment} env The environment
     * @param {mixed} error
     */
    error: function (env, error) {}
});

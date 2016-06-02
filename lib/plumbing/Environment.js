"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");

/**
 * The environment is responsible for loading the gabarito, the test files and
 * running the tests themselves.
 *
 * It must implement the method getName in order to describe itself to the
 * reporters.
 *
 * The dispatch method receives the files list, the reporters involved and a
 * callback function that should be called when things complete, passing the
 * results to the callback function as first argument.
 *
 * @class gabarito.plumbing.Environment
 * @constructor
 */
module.exports = ilk().proto({

    /**
     * The environment's name
     *
     * @method getName
     * @for gabarito.plumbing.Environment
     *
     * @return {string}
     */
    getName: function () {
        throw new Error("Unimplemented method.");
    },

    /**
     * Method called by the runner that receives the files to be loaded, the
     * reporters that should receive all events and the callback function that
     * must be called passing all the results at the end of things.
     *
     * @method dispatch
     * @for gabarito.plumbing.Environment
     *
     * @param {string[]} files The files list
     * @param {gabarito.plumbing.Reporter[]} reporters
     * @param {function} done
     */
    dispatch: function (files, reporters, done) {
        throw new Error("Unimplemented method.");
    }
});

(function (node) {
    "use strict";

    var main = node? global: window;
    var parts = node? require("parts"): main.parts;

    var test = function (m, f) {
        var l = f.length + 1;
        return parts.args(function (args) {
            var msg = args.length === l? args.pop(): m;
            if (!f.apply(null, args)) {
                throw new Error(msg);
            }
        });
    };

    var sameAsNull = parts.sameAs(null);
    var sameAsUndefined = parts.sameAs(undefined);

    /**
     * Static class that contains various assertions
     *
     * @class gabarito.Assert
     * @static
     */
    var assert = {
        /**
         * Asserts that both values are the same (using ===)
         *
         * @method areSame
         * @for gabarito.Assert
         *
         * @param {mixed} a A value
         * @param {mixed} b Another value
         */
        areSame: test("Values are not the same",
            function (a, b) { return a === b; }),

        /**
         * Asserts that both values are equal (using parts.Parts/equals method).
         *
         * @method areEqual
         * @for gabarito.Assert
         *
         * @param {mixed} a A value
         * @param {mixed} b A another value
         */

        /**
         * Asserts that both values are equals by using the passed equality
         * function.
         *
         * The equality function will receive both values as arguments and it
         * must returns true if the values are considered equal.
         *
         * @method areEqual
         * @for gabarito.Assert
         *
         * @param {mixed} a A value
         * @param {mixed} b Another value
         * @param {function} equality The equality function
         */

        /**
         * Asserts that both values are equal (using parts.Parts/equals method).
         *
         * @method areEqual
         * @for gabarito.Assert
         *
         * @param {mixed} a A value
         * @param {mixed} b Another value
         * @param {string} msg The error message
         */

        /**
         * Asserts that both values are equals by using the passed equality
         * function.
         *
         * The equality function will receive both values as arguments and it
         * must returns true if the values are considered equal.
         *
         * @method areEqual
         * @for gabarito.Assert
         *
         * @param {mixed} a A value
         * @param {mixed} b Another value
         * @param {function} equality The equality function
         * @param {string} msg The error message
         */
        areEqual: function (a, b, equality, msg) {
            switch (arguments.length) {
            case 2: return assert.areEqual(a, b, parts.equals);
            case 3: return parts.isFunction(equality)?
                    assert.areEqual(a, b, equality, "Values should be equal."):
                    assert.areEqual(a, b, parts.equals, equality);
            default:
                if (!equality(a, b)) {
                    throw new Error(msg);
                }
            }
        },

        /**
         * Asserts that a given value is an array.
         *
         * @method isArray
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isArray: test("Value should be an array.", parts.isArray),

        /**
         * Asserts that a given value is a boolean.
         *
         * @method isBoolean
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isBoolean: test("Value should be a boolean.", parts.isBoolean),

        /**
         * Asserts that a given value is a function.
         *
         * @method isFunction
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isFunction: test("Value should be a function.", parts.isFunction),

        /**
         * Asserts that a given value is a number and is not NaN.
         *
         * @method isNumber
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isNumber: test("Value should be a number.", parts.isNumber),

        /**
         * Asserts that a given value is an object.
         *
         * @method isObject
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isObject: test("Value should be an object.", parts.isObject),

        /**
         * Asserts that a given value is a string.
         *
         * @method isString
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isString: test("Value should be a string.", parts.isString),

        /**
         * Asserts that a given value is a RegExp instance.
         *
         * @method isRegExp
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isRegExp: test("Value should be a RegExp instance.", parts.isRegExp),

        /**
         * Asserts that a given value is a Date instance.
         *
         * @method isDate
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isDate: test("Value should be a Date instance.", parts.isDate),

        /**
         * Asserts that a given value is an instance of a given type.
         *
         * @method isInstanceOf
         * @for gabarito.Assert
         *
         * @param {mixed} o The object
         * @param {function} t The type
         * @param {string} [msg] The error message
         */
        isInstanceOf: test("Value should be an instance of type.",
                function (o, t) { return o instanceof t; }),

        /**
         * Asserts that a given value is false.
         *
         * @method isFalse
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isFalse: test("Value should be false.", parts.sameAs(false)),

        /**
         * Asserts that a given value is true.
         *
         * @method isTrue
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isTrue: test("Value should be true.", parts.sameAs(true)),

        /**
         * Asserts that a given value is NaN.
         *
         * Note that the value should be the actual NaN and not something that
         * converts to NaN.
         *
         * @method isNaN
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isNaN: test("Value should be NaN.", parts.isNaN),

        /**
         * Asserts that a given value is not NaN.
         *
         * Note that the value should be the actual NaN and not something that
         * converts to NaN.
         *
         * @method isNotNaN
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isNotNaN: test("Value should not be NaN.", parts.negate(parts.isNaN)),

        /**
         * Asserts that a given value is null.
         *
         * @method isNull
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isNull: test("Value should be null.", sameAsNull),

        /**
         * Asserts that a given value is not null.
         *
         * @method isNotNull
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isNotNull: test("Value should not be null.", parts.negate(sameAsNull)),

        /**
         * Asserts that a given value is undefined.
         *
         * @method isUndefined
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isUndefined: test("Value should be undefined.", sameAsUndefined),

        /**
         * Asserts that a given value is undefined.
         *
         * @method isNotUndefined
         * @for gabarito.Assert
         *
         * @param {mixed} v Value
         * @param {string} [msg] The error message
         */
        isNotUndefined: test("Value should not be undefined.",
                parts.negate(sameAsUndefined))

    };

    var createGabarito = function () {
        var sketches;
        var results;
        var waitingTimeout;
        var waiting;
        var currentResult;
        var listeners;
        var onResume;

        var runBlock = function (block, done) {
            try {
                block();
            } catch (e) {
                return done(e);
            }

            if (!waiting) {
                done();
            } else {
                onResume = function (block) { runBlock(block, done); };
            }
        };

        var verifySketch = function (sketch, done) {
            currentResult = {
                sketch: sketch,
                results: {},
                start: parts.now()
            };

            var drafts = [];
            parts.forEach(sketch, function (v, p) {
                if (parts.isFunction(v)) {
                    drafts.push(p);
                }
            });

            nextDraft(sketch, drafts, function () {
                currentResult.elapsedTime = parts.now() - currentResult.start;
                results.push(currentResult);
                currentResult = undefined;
                done();
            });
        };

        var nextDraft = function (sketch, drafts, done) {
            var draft = drafts.shift();
            if (draft) {
                verifyDraft(sketch, draft, function() {
                    nextDraft(sketch, drafts, done);
                });
            } else {
                done();
            }
        };

        var verifyDraft = function (sketch, draft, done) {
            var draftResult = {
                start: parts.now()
            };

            currentResult.results[draft] = draftResult;

            runBlock(sketch[draft], function (error) {
                draftResult.elapsedTime = parts.now() - draftResult.start;

                if (error) {
                    draftResult.error = error;
                }

                emit(error? "fail": "pass", sketch, draft, draftResult);
                done();
            });
        };

        var nextSketch = function (done) {
            var sketch = sketches.shift();
            if (sketch) {
                verifySketch(sketch, function () { nextSketch(done); });
            } else {
                done();
            }
        };

        var emit = function (e) {
            var args = parts.slice(arguments, 1);
            parts.forEach(listeners[e], function (f) { f.apply(null, args); });
        };

        /**
         * The gabarito class responsible for ensuring that the gabarito is
         * sound.
         *
         * @class gabarito.Gabarito
         * @constructor
         */
        return {
            /**
             * Reference containing the various assert utils.
             *
             * @property assert
             * @for gabarito.Gabarito
             * @type {gabarito.Assert}
             */
            assert: assert,

            /**
             * Resets the gabarito to it's initial state, removing all listeners
             * as well.
             *
             * @method reset
             * @for gabarito.Gabarito
             */
            reset: function() {
                sketches = [];
                results = [];

                if (waitingTimeout !== undefined) {
                    clearTimeout(waitingTimeout);
                    waitingTimeout = undefined;
                }

                waiting = false;
                currentResult = undefined;
                listeners = {
                    "begin": [],
                    "end": [],
                    "pass": [],
                    "fail": []
                };
                onResume = undefined;
            },

            /**
             * Adds a sketch within the gabarito.
             *
             * The sketch is an object containing various methods. Each method
             * is treated as a draft. Every draft is run to check if it works.
             *
             * @method sketch
             * @for gabarito.Gabarito
             *
             * @param {object} sketch The sketch itself
             */
            sketch: function (sketch) {
                sketches.push(sketch);
            },

            /**
             * Tells the gabarito to wait for an async continuation of a draft.
             *
             * @method stay
             * @for gabarito.Gabarito
             *
             * @param {number} [timeout] Timeout before it breaks (defaults to 10000);
             */
            stay: function (timeout) {
                if (waiting) {
                    waiting = false;
                    throw new Error("Already waiting.");
                }

                waiting = true;
                waitingTimeout = setTimeout(function () {
                    if (waiting) {
                        gabarito.go(function () {
                            throw new Error("Timeout reached.");
                        });
                    }
                }, timeout || 10000);
            },

            /**
             * Tells the gabarito to resume the current draft
             *
             * @method go
             * @for gabarito.Gabarito
             *
             * @param {function} [block]
             */
            go: function (block) {
                if (!waiting) {
                    throw new Error("Go called without stay.");
                }
                clearTimeout(waitingTimeout);
                waiting = false;
                onResume(block || function () {});
            },

            /**
             * Returns a function that when called, tells gabarito to resume the
             * current draft and also passes the parameters along to the given
             * function.
             *
             * Just a syntatic sugar to avoid another nesting level.
             *
             * @method going
             * @for gabarito.Gabarito
             *
             * @param {function} [block]
             */
            going: function (block) {
                return parts.args(parts.that(function (that, args) {
                    gabarito.go(function () {
                        if (block) {
                            block.apply(that, args);
                        }
                    });
                }));
            },

            /**
             * Register an event listener for a given event.
             *
             * Available events:
             *
             * - begin: The beginning of the gabarito veritication
             * - end: The end of the gabarito verification
             * - pass: Whenever a draft passes
             * - fail: Whenever a draft fails
             *
             * @method on
             * @for gabarito.Gabarito
             *
             * @param {string} event
             * @param {function} listener
             */
            on: function (event, listener) {
                if (!(event in listeners)) {
                    throw new TypeError("Unknown event: " + event);
                }
                listeners[event].push(listener);
            },

            /**
             * Attest all the sketches
             *
             * @method attest
             * @for gabarito.Gabarito
             *
             * @param {function} [done]
             */
            attest: function (done) {
                emit("begin", sketches);
                nextSketch(function () {
                    emit("end", results);
                    if (done) {
                        done(results);
                    }
                });
            }
        };
    };

    var gabarito = createGabarito();
    gabarito.standalone = createGabarito;

    gabarito.reset();

    if (node) {
        module.exports = gabarito;
        gabarito.runner = {
            Runner: require("./runner/Runner"),

            Reporter: require("./runner/Reporter"),
            ConsoleReporter: require("./runner/ConsoleReporter"),

            Environment: require("./runner/Environment"),
            NodeEnvironment: require("./runner/NodeEnvironment")
        };
    } else {
        main.gabarito = gabarito;
    }

}(typeof exports !== "undefined" && global.exports !== exports));
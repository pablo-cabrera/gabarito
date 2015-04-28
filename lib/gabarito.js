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
         * Asserts that both values are not the same (using !==)
         *
         * @method areNotSame
         * @for gabarito.Assert
         *
         * @param {mixed} a A value
         * @param {mixed} b Another value
         */
        areNotSame: test("Values are the same",
            function (a, b) { return a !== b; }),

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
                parts.negate(sameAsUndefined)),

        /**
         * Asserts that a given object has a property
         *
         * @method hasProperty
         * @for gabarito.Assert
         *
         * @param {object} o The object
         * @param {string} p The property name
         * @param {string} [msg] The error message
         */
        hasProperty: test("Object should have the property",
                function (o, p) { return p in o; }),

        /**
         * Asserts that a given object owns a property
         *
         * @method hop
         * @for gabarito.Assert
         *
         * @param {object} o The object
         * @param {string} p The property name
         * @param {string} [msg] The error message
         */
        hop: test("Object should own the property", parts.hop)

    };

    var Gabarito = parts.tokens(function (
        tests,
        results,
        waitingTimeout,
        waiting,
        currentResult,
        listeners,
        onResume,
        preparing,
        onPrepare,

        runBlock,
        verifyTest,
        nextClause,
        verifyClause,
        nextTest,
        emit
    ) {
        var privateProperties = [
            tests,
            results,
            waitingTimeout,
            waiting,
            currentResult,
            listeners,
            onResume,
            preparing,
            onPrepare
        ];

        return parts.type(parts.that(function (t) {
            /**
             * Reference containing the various assert utils.
             *
             * @property assert
             * @for gabarito.Gabarito
             * @type {gabarito.Assert}
             */
            this.assert = assert;

            parts.forEach(privateProperties, function (p) { p.mark(t); });

            this.reset();
        })).

        constant("standalone", function () {
            return new Gabarito();
        }).

        proto(runBlock, parts.that(function (that, block, done) {
            try {
                block();
            } catch (e) {
                return done(e);
            }

            if (!this[waiting]) {
                done();
            } else {
                this[onResume] = function (block) {
                        that[runBlock](block, done); };
            }
        })).

        proto(verifyTest, parts.that(function (that, test, done) {
            this[currentResult] = {
                test: test,
                results: {},
                start: parts.now()
            };

            var clauses = [];
            parts.forEach(test, function (v, p) {
                if (p !== "before" && p !== "after" && parts.isFunction(v)) {
                    clauses.push(p);
                }
            });

            this[emit]("begin", test);

            this[nextClause](test, clauses, function () {
                that[currentResult].elapsedTime = parts.now() -
                        that[currentResult].start;

                that[results].push(that[currentResult]);
                that[emit]("end", that[currentResult]);
                that[currentResult] = undefined;
                done();
            });
        })).

        proto(nextClause, parts.that(function (that, test, clauses, done) {
            var clause = clauses.shift();
            if (clause) {
                this[verifyClause](test, clause, function() {
                    that[nextClause](test, clauses, done);
                });
            } else {
                done();
            }
        })).

        proto(verifyClause, parts.that(function (that, test, clause, done) {
            var result = { start: parts.now() };

            var finish = function (error) {
                result.elapsedTime = parts.now() - result.start;

                if (error) {
                    result.error = error;
                }

                that[emit](error? "fail": "pass", test, clause, result);

                if (parts.isFunction(test.after)) {
                    that[runBlock](test.after, function () { done(); });
                } else {
                    done();
                }
            };

            this[currentResult].results[clause] = result;

            this[emit]("enter", test, clause);

            if (parts.isFunction(test.before)) {
                this[runBlock](test.before, function (error) {
                    if (error) {
                        finish(error);
                    } else {
                        that[runBlock](test[clause], finish);
                    }
                });
            } else {
                that[runBlock](test[clause], finish);
            }
        })).

        proto(nextTest, parts.that(function (that, tests, done) {
            var test = tests.shift();
            if (test) {
                this[verifyTest](test, function () {
                        that[nextTest](tests, done); });
            } else {
                done();
            }
        })).

        proto(emit, function (e) {
            var args = parts.slice(arguments, 1);
            parts.forEach(this[listeners][e],
                    function (f) { f.apply(null, args); });
        }).

        proto({


            standalone: function () {
                return this.constant("standalone")();
            },

            /**
             * Resets the gabarito to it's initial state, removing all listeners
             * as well.
             *
             * @method reset
             * @for gabarito.Gabarito
             */
            reset: function() {
                this[preparing] = false;
                this[tests] = [];
                this[results] = [];

                if (this[waitingTimeout] !== undefined) {
                    clearTimeout(this[waitingTimeout]);
                    this[waitingTimeout] = undefined;
                }

                this[waiting] = false;
                this[currentResult] = undefined;
                this[listeners] = {
                    "init": [],
                    "begin": [],
                    "enter": [],
                    "end": [],
                    "pass": [],
                    "fail": [],
                    "complete": [],
                    "say": []
                };
                this[onResume] = undefined;
            },

            /**
             * Tells gabarito that the preparations will be async.
             *
             * This method returns a function that should be called when all
             * tests are ready.
             */
            prepare: parts.that(function (that) {
                this[preparing] = true;
                return function () {
                    that[preparing] = false;
                    if (that[onPrepare]) {
                        that[onPrepare]();
                    }
                };
            }),

            /**
             * Adds a test within the gabarito.
             *
             * The sketch is an object containing various methods. Each method
             * is treated as a draft. Every draft is run to check if it works.
             *
             * @method sketch
             * @for gabarito.Gabarito
             *
             * @param {object} test The test itself
             */
            add: function (test) {
                this[tests].push(test);
            },

            /**
             * Tells the gabarito to wait for an async continuation of a draft.
             *
             * @method stay
             * @for gabarito.Gabarito
             *
             * @param {number} [timeout] Timeout before it breaks
             *                           (defaults to 10000);
             */
            stay: parts.that(function (that, timeout) {
                if (this[waiting]) {
                    this[waiting] = false;
                    throw new Error("Already waiting.");
                }

                this[waiting] = true;
                this[waitingTimeout] = setTimeout(function () {
                    if (that[waiting]) {
                        that.go(function () {
                            throw new Error("Timeout reached.");
                        });
                    }
                }, timeout || 10000);
            }),

            /**
             * Tells the gabarito to resume the current draft
             *
             * @method go
             * @for gabarito.Gabarito
             *
             * @param {function} [block]
             */
            go: function (block) {
                if (!this[waiting]) {
                    throw new Error("Go called without stay.");
                }
                clearTimeout(this[waitingTimeout]);
                this[waiting] = false;
                this[onResume](block || function () {});
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
            going: parts.that(function (that, block) {
                return parts.args(parts.that(function (myThis, args) {
                    that.go(function () {
                        if (block) {
                            block.apply(myThis, args);
                        }
                    });
                }));
            }),

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
                if (!(event in this[listeners])) {
                    throw new TypeError("Unknown event: " + event);
                }
                this[listeners][event].push(listener);
            },

            /**
             * Verify all tests
             *
             * @method verify
             * @for gabarito.Gabarito
             *
             * @param {function} [done]
             */
            verify: parts.that(function (that, done) {
                this[onPrepare] = function () {
                    this[emit]("init", this[tests]);
                    this[nextTest](this[tests].slice(), function () {
                        var doneResults = that[results];
                        that[emit]("complete", doneResults);
                        that.reset();
                        if (done) {
                            done(doneResults);
                        }
                    });
                };

                if (!this[preparing]) {
                    this[onPrepare]();
                }
            }),

            /**
             * Tells gabarito to say something.
             *
             * @method say
             * @for gabarito.Gabarito
             *
             * @param {mixed} args*
             */
            say: parts.args(function (args) {
                this[emit].apply(this, ["say"].concat(args));
            })
        });
    });

    var gabarito = new Gabarito();

    if (node) {
        module.exports = gabarito;
        gabarito.plumbing = {
            Runner: require("./plumbing/Runner"),

            Reporter: require("./plumbing/Reporter"),
            ConsoleReporter: require("./plumbing/ConsoleReporter"),
            JUnitXmlReporter: require("./plumbing/JUnitXmlReporter"),

            Environment: require("./plumbing/Environment"),
            NodeEnvironment: require("./plumbing/NodeEnvironment"),
            SeleniumEnvironment: require("./plumbing/SeleniumEnvironment"),
            VBoxSeleniumEnvironment: require("./plumbing/VBoxSeleniumEnvironment")
        };
    } else {
        main.gabarito = gabarito;
    }

}(typeof exports !== "undefined" && global.exports !== exports));
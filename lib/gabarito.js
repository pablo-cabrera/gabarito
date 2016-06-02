(function (node) {
    "use strict";

    var main;
    var ilk;
    var parts;

    if (node) {
        main = global;
        parts = require("../deps/parts");
        ilk = require("../deps/ilk");
    } else {
        main = window;
        parts = main.parts;
        ilk = main.ilk;
        try {
            delete main.parts;
            delete main.ilk;
        } catch (e) {
            main.parts = undefined;
            main.ilk = undefined;
        }
    }

    var formatMessage = function (msg, args) {
        var s = msg;
        parts.forEach(args, function (arg) { s = s.replace("%s", arg); });
        return s;
    };

    var test = function (m, f) {
        var l = f.length + 1;
        return parts.args(function (args) {
            var msg = args.length === l? args.pop(): m;
            if (!f.apply(null, args)) {
                throw new Error(formatMessage(msg, args));
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
        areSame: test("Values are not the same.\nExpected: %s\nActual: %s",
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
        areNotSame: test("Values are the same.\nExpected: %s\nActual: %s",
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
                    assert.areEqual(a, b, equality,
                        "Values should be equal..\nExpected: %s\nActual: %s"):
                    assert.areEqual(a, b, parts.equals, equality);
            default:
                if (!equality(a, b)) {
                    throw new Error(formatMessage(msg, [a, b]));
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
        hop: test("Object should own the property", parts.hop),

        /**
         * A nice helper to use asserts in a more expressive way. It has all
         * the methods from the assert itself.
         *
         * Usage:
         * ```
         * assert.that(someValue).isEqualTo("3");
         * ```
         * @method that
         * @for gabarito.Assert
         *
         *@param {mixed} value
         *@return gabarito.AssertThat
         */
        that: function (v) {
            return new AssertThat(v);
        }

    };

    var AssertThat = ilk.tokens(function (value) {
        /**
         * A nice helper to use asserts in a more expressive way. It has all
         * the methods from the {{#crossLink "gabarito.Assert"}}{{/crossLink}}.
         *
         * @class gabarito.AssertThat
         * @constructor
         *
         * @param {mixed} value
         */
        var AssertThat = ilk(function (v) {
            value.mark(this, v);
        }).

        proto({

            /**
             * Asserts that a given collection has a given number of elements
             *
             * @method hasSizeOf
             * @for gabarito.AssertThat
             *
             * @param {number} size The given size
             * @param {string} [msg] The error message
             */
            hasSizeOf: parts.overload(
                function (size) {
                    this.hasSizeOf(size, "Size mismatch.");
                },
                function (size, msg) {
                    assert.areSame(this[value].length, size, msg);
                })
        });

        /**
         * Asserts that both values are the same (using ===)
         *
         * @method isTheSameAs
         * @for gabarito.AssertThat
         *
         * @param {mixed} b Another value
         */

        /**
         * Asserts that both values are not the same (using !==)
         *
         * @method isNotTheSameAs
         * @for gabarito.AssertThat
         *
         * @param {mixed} b Another value
         */

        /**
         * Asserts that both values are equal (using parts.Parts/equals method).
         *
         * @method isEqualTo
         * @for gabarito.AssertThat
         *
         * @param {mixed} b A another value
         */

        /**
         * Asserts that both values are equals by using the passed equality
         * function.
         *
         * The equality function will receive both values as arguments and it
         * must returns true if the values are considered equal.
         *
         * @method isEqualTo
         * @for gabarito.AssertThat
         *
         * @param {mixed} b Another value
         * @param {function} equality The equality function
         */

        /**
         * Asserts that both values are equal (using parts.Parts/equals method).
         *
         * @method isEqualTo
         * @for gabarito.AssertThat
         *
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
         * @method isEqualTo
         * @for gabarito.AssertThat
         *
         * @param {mixed} b Another value
         * @param {function} equality The equality function
         * @param {string} msg The error message
         */

        /**
         * Asserts that a given value is an array.
         *
         * @method isArray
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is a boolean.
         *
         * @method isBoolean
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is a function.
         *
         * @method isFunction
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is a number and is not NaN.
         *
         * @method isNumber
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is an object.
         *
         * @method isObject
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is a string.
         *
         * @method isString
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is a RegExp instance.
         *
         * @method isRegExp
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is a Date instance.
         *
         * @method isDate
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is an instance of a given type.
         *
         * @method isInstanceOf
         * @for gabarito.AssertThat
         *
         * @param {function} t The type
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is false.
         *
         * @method isFalse
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is true.
         *
         * @method isTrue
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is NaN.
         *
         * Note that the value should be the actual NaN and not something that
         * converts to NaN.
         *
         * @method isNaN
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is not NaN.
         *
         * Note that the value should be the actual NaN and not something that
         * converts to NaN.
         *
         * @method isNotNaN
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is null.
         *
         * @method isNull
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is not null.
         *
         * @method isNotNull
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is undefined.
         *
         * @method isUndefined
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given value is undefined.
         *
         * @method isNotUndefined
         * @for gabarito.AssertThat
         *
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given object has a property
         *
         * @method hasProperty
         * @for gabarito.AssertThat
         *
         * @param {string} p The property name
         * @param {string} [msg] The error message
         */

        /**
         * Asserts that a given object owns a property
         *
         * @method hop
         * @for gabarito.AssertThat
         *
         * @param {string} p The property name
         * @param {string} [msg] The error message
         */


        parts.forEach(assert, function (v, p) {
            if (p !== "that") {

                AssertThat.proto(
                    p === "areSame"? "isTheSameAs":
                    p === "areNotSame"? "isNotTheSameAs":
                    p === "areEqual"? "isEqualTo":
                    p,
                    parts.args(function (args) {
                        args.unshift(this[value]);
                        return assert[p].apply(null, args);
                    }));
            }
        });

        return AssertThat;
    });

    var TestBuilder = ilk.tokens(function (test) {
        var unimplemented = function () {
            throw new Error("Unimplemented clause.");
        };

        /**
         * The test builder is a helper that builds a test in a more expressive
         * way.
         *
         * Usage:
         * ```
         * gabarito.test().
         * name("test name").
         * before(function () {
         *     // runs before each clause
         * }).
         * after(function () {
         *     // runs after each clause
         * }).
         *
         * clause("an unimplemented clause").
         * clause("another clause", function () {
         *    // clause body
         * });
         * ```
         *
         * @class gabarito.TestBuilder
         * @constructor
         *
         * @param {object} test The actual test object
         */
        return ilk(function (t) {
            test.mark(this, t);
        }).

        proto({

            /**
             * Adds a clause within the test object.
             *
             * If the clause body is omitted, an unimplemented clause that
             * always throws an error will be used instead.
             *
             * @method clause
             * @for gabarito.TestBuilder
             *
             * @param {string} name
             * @param {function} [body]
             * @return {gabarito.TestBuilder}
             */
            clause: function (name, body) {
                this[test][name] = body || unimplemented;
                return this;
            },

            /**
             * Sets the before function within the test object.
             *
             * @method before
             * @for gabarito.TestBuilder
             *
             * @param {function} before
             * @return {gabarito.TestBuilder}
             */
            before: function (before) {
                this[test].before = before;
                return this;
            },

            /**
             * Sets the after function within the test object.
             *
             * @method after
             * @for gabarito.TestBuilder
             *
             * @param {function} after
             * @return {gabarito.TestBuilder}
             */
            after: function (after) {
                this[test].after = after;
                return this;
            },

            /**
             * Sets test name for the test object.
             *
             * @method name
             * @for gabarito.TestBuilder
             *
             * @param {string} name
             * @return {gabarito.TestBuilder}
             */
            name: function (name) {
                this[test].name = name;
                return this;
            }
        });
    });

    var Matcher = ilk.tokens(function (msg) {
        var shared = { msg: msg };

        var ordinal = function (n) {
            var s = String(n);
            var ld = s.substr(-1);

            return n > 9 && n < 10? s + "th":
                ld === "1"? s + "st":
                ld === "2"? s + "nd":
                ld === "3"? s + "rd":
                s + "th";
        };

        /**
         * The matcher consists of a single function that evaluates whether a
         * given values meets the matcher function criteria.
         *
         * @class gabarito.Matcher
         * @constructor
         *
         * @param {function} matcher The matcher function
         * @param {string} [msg] The error message
         */
        return ilk(parts.overload(
            function (matcher) {
                Matcher.call(this, matcher,
                    "%s argument mismatch.\nArgument: %s");
            },

            function (matcher, pMsg) {
                msg.mark(this, pMsg);

                /**
                 * The mather method should evaluate the matcher function and
                 * tell whether the value matches the criteria.
                 *
                 * @method matches
                 * @for gabarito.Matcher
                 *
                 * @param {mixed} value
                 * @return {boolean}
                 */
                this.matches = matcher;
            }), shared).

        proto({

            /**
             * Returns the Error instance with the formatted message using the
             * argument's position and the argument itself.
             *
             * @method error
             * @for gabarito.Matcher
             *
             * @param {number} position Argument position
             * @param {mixed} arg
             * @return {Error}
             */
            error: function (position, arg) {
                return new Error(formatMessage(this[msg],
                        [ordinal(position), arg]));
            }
        });
    });



    /**
     * The varargs matcher uses a single function that will receive an array
     * containing all the remaining args passed to the function while applying
     * the matchers.
     *
     * This matcher should always be the last matcher.
     *
     * @class gabarito.VarargsMatcher
     * @extends gabarito.Matcher
     * @constructor
     *
     * @param {function} matcher The matcher function
     */
    var VarargsMatcher = (function () {
        var shared = {};

        return Matcher.descend(shared).
        proto({

            /**
             * Returns the Error instance with the formatted message using the
             * arguments passed to the matcher.
             *
             * @method error
             * @for gabarito.VarargsMatcher
             *
             * @param {mixed[]} args The actual varargs array
             * @return {Error}
             */
            error: function (args) {
                return new Error(formatMessage(this[shared.msg], [args]));
            }
        });
    }());

    var matcher = parts.overload(
        function (fn) {
            return matcher(fn, "%s argument mismatch.\nArgument: %s");
        },
        function (fn, msg) {
            return new Matcher(fn, msg);
        });

    parts.merge(matcher, {

        /**
         * Matcher for string type
         *
         * @property matcher.STRING
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        STRING: new Matcher(parts.isString,
                "%s argument mismatch, it should be a string."),

        /**
         * Matcher for array type
         *
         * @property matcher.ARRAY
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        ARRAY: new Matcher(parts.isArray,
                "%s argument mismatch, it should be an array."),

        /**
         * Matcher for function type
         *
         * @property matcher.FUNCTION
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        FUNCTION: new Matcher(parts.isFunction,
                "%s argument mismatch, it should be a function."),

        /**
         * Matcher for object type
         *
         * @property matcher.OBJECT
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        OBJECT: new Matcher(parts.isObject,
                "%s argument mismatch, it should be an object."),

        /**
         * Matcher for array type
         *
         * @property matcher.NUMBER
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        NUMBER: new Matcher(parts.isNumber,
                "%s argument mismatch, it should be a number."),

        /**
         * Always matches
         *
         * @property matcher.ANY
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        ANY: new Matcher(parts.constant(true)),

        /**
         * Always matches any varargs
         *
         * @property matcher.ANY_ARGS
         * @for gabarito.Gabarito
         * @type {gabarito.VarargsMatcher}
         */
        ANY_ARGS: new VarargsMatcher(parts.constant(true)),

        /**
         * Matcher for a given type
         *
         * @method matcher.type
         * @for gabarito.Gabarito
         *
         * @param {function} type
         * @param {string} [msg] The optional message format
         * @return gabarito.Matcher
         */
        type: parts.overload(
            function (type) {
                return matcher.type(type, "%s argument mismatch, wrong type.");
            },
            function (type, msg) {
                return new Matcher(function (v) { return v instanceof type; },
                        msg);
            }),

        /**
         * Matcher for varargs
         *
         * @method matcher.args
         * @for gabarito.Gabarito
         *
         * @param {function} fn
         * @param {string} [msg] The optional message format
         * @return {gabarito.VarargsMatcher}
         */
        args: parts.overload(
            function (fn) {
                return matcher.args(fn, "Varargs mismatch.");
            },
            function (fn, msg) {
                return new VarargsMatcher(fn, msg);
            }),

        /**
         * Literal value matcher
         *
         * If given value is an object (not a function) or an array, it uses
         * parts.equals, otherwise it will check for it's identity
         *
         * @method matcher.value
         * @for gabarito.Gabarito
         *
         * @param {mixed} v
         * @return {gabarito.Matcher}
         */
        value: function (v) {
            return new Matcher(
                parts.isArray(v) || (!parts.isFunction(v) && parts.isObject(v))?
                function (o) { return parts.equals(v, o); }:
                function (o) { return v === o; },
                "%s argument mismatch.\nExpected: " + v + "\nActual: %s");
        }

    });

    var Spy = ilk.tokens(function (
        calls,
        call,

        getMatcher
    ) {

        /**
         * The verifier is used to check for the arguments, return or error
         * thrown.
         *
         * @class gabarito.SpyVerifier
         * @constructor
         *
         * @param {gabarito.SpyCall} call
         */
        var SpyVerifier = ilk(function (pCall) {
            call.mark(this, pCall);
        }).

        proto(getMatcher, function (v) {
            return v instanceof Matcher? v: matcher.value(v);
        }).

        proto({
            /**
             * Checks if the calls arguments matches with the given matchers
             *
             * @method args
             * @for gabarito.SpyVerifier
             *
             * @param {gabarito.Matcher|mixed} ...matchers
             * @return {gabarito.SpyVerifier}
             */
            args: parts.args(parts.that(function (that, args) {
                if (args.length === 0) {
                    throw new Error("No args to check.");
                }

                var lastArg = args[args.length - 1];
                if (!(lastArg instanceof VarargsMatcher) &&
                        args.length !== this[call].args.length) {
                    throw new Error(formatMessage(
                        "Args number mismatch: %s args passed, expected %s.",
                        [this[call].args.length, args.length]));
                }

                parts.forEach(args, function (a, i) {
                    var m = that[getMatcher](a);

                    if (m instanceof VarargsMatcher) {
                        if (m === lastArg) {
                            if (!m.matches(that[call].args.slice(i))) {
                                throw m.error(that[call].args.slice(i));
                            }
                        } else {
                            throw new Error(
                                "VarargsMatcher should be the last matcher.");
                        }
                    } else if (!m.matches(that[call].args[i])) {
                        throw m.error(i + 1, that[call].args[i]);
                    }
                });

                return this;
            })),

            /**
             * Checks what has been throw by the call using the matcher o a
             * value matcher.
             *
             * @method throwing
             * @for gabarito.SpyVerifier
             *
             * @param {gabarito.Matcher|mixed} v
             * @return {gabarito.SpyVerifier}
             */
            throwing: function (v) {
                if (!parts.hop(this[call], "thrown")) {
                    throw new Error("Error not thrown.");
                }

                if (!this[getMatcher](v).matches(this[call].thrown)) {
                    throw new Error("Error mismatch.");
                }

                return this;
            },

            /**
             * Checks what has been returmed by the call using the matcher o a
             * value matcher.
             *
             * @method returning
             * @for gabarito.SpyVerifier
             *
             * @param {gabarito.Matcher|mixed} v
             * @return {gabarito.SpyVerifier}
             */
            returning: function (v) {
                if (!parts.hop(this[call], "returning")) {
                    throw new Error("Didn't return.");
                }

                if (!this[getMatcher](v).matches(this[call].returning)) {
                    throw new Error("Return mismatch.");
                }

                return this;
            }
        });

        /**
         * The spy relays the calls to the actual function, but records every
         * call, along with its parameters, its return or error if thrown.
         *
         * To verify a given call, the {#crossLink
         * "gabarito.SpyVerifier"}}{{/crossLink}} may be obtained through the
         * verify method.
         *
         * @class gabarito.Spy
         * @constructor
         *
         * @param {function} fn The function to spy on
         */
        return ilk(parts.that(function (that, fn) {
            var subject = fn || parts.k;
            calls.mark(this, []);

            /**
             * The handler function that relays all the calls, this is the
             * actual function that should be used instead of the real one.
             *
             * @property handler
             * @for gabarito.Spy
             * @type {function}
             */
            this.handler = parts.args(function (args) {
                var call = {
                    that: this,
                    args: args
                };

                that[calls].push(call);

                try {
                    call.returning = subject.apply(this, args);
                    return call.returning;
                } catch (e) {
                    call.thrown = e;
                    throw e;
                }
            });

            /**
             * Relays the verify call to the spy instance.
             *
             * @method handler.verify
             * @for gabarito.Spy
             *
             * @return {gabarito.SpyVerifier}
             */
            this.handler.verify = function () {
                return that.verify();
            };

            /**
             * Relays the noCalls call to the spy instance.
             *
             * @method handler.noCalls
             * @for gabarito.Spy
             */
            this.handler.noCalls = function () {
                that.noCalls();
            };

            /**
             * Relays the reset call to the spy instance.
             *
             * @method handler.reset
             * @for gabarito.Spy
             */
            this.handler.reset = function () {
                that.reset();
            };

        })).

        constant({

            /**
             * Creates a spy instance and returns its handler
             *
             * @method on
             * @for gabarito.Spy
             * @static
             *
             * @param {function} fn The function to spy on
             * @return {function} Returns the handler function from the spy
             *         instance
             */
            on: function (fn) {
                return new Spy(fn).handler;
            }
        }).

        proto({
            /**
             * Returns a spy verifier if a call was made
             *
             * @method verify
             * @for gabarito.Spy
             *
             * @return {gabarito.SpyVerifier}
             */
            verify: function () {

                if (this[calls].length === 0) {
                    throw new Error("No calls were made.");
                }

                return new SpyVerifier(this[calls].shift());
            },

            /**
             * Throws an error if a call was made
             *
             * @method noCalls
             * @for gabarito.Spy
             */
            noCalls: function () {
                if (this[calls].length !== 0) {
                    throw new Error("A call was made.");
                }
            },

            /**
             * Removes all recorded calls from the instance
             *
             * @method reset
             * @for gabarito.Spy
             */
            reset: function () {
                this[calls] = [];
            }
        });
    });




    var Gabarito = ilk.tokens(function (
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

        return ilk(parts.that(function (t) {
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
                test: test.name,
                results: {},
                start: parts.now()
            };

            var clauses = [];
            parts.forEach(test, function (v, p) {
                if (p !== "before" && p !== "after" && parts.isFunction(v)) {
                    clauses.push(p);
                }
            });

            this[emit]("begin", test.name);

            this[nextClause](test, clauses, function () {
                that[currentResult].elapsedTime = parts.now() -
                        that[currentResult].start;

                that[results].push(that[currentResult]);
                that[emit]("end", test.name, that[currentResult]);
                that[currentResult] = undefined;
                done();
            });
        })).

        proto(nextClause, parts.that(function (that, test, clauses, done) {
            var clause = clauses.shift();
            if (clause) {
                this[verifyClause](test, clause, function () {
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

                that[emit](error? "fail": "pass", test.name, clause, result);

                if (parts.isFunction(test.after)) {
                    that[runBlock](test.after, function () { done(); });
                } else {
                    done();
                }
            };

            this[currentResult].results[clause] = result;

            this[emit]("enter", test.name, clause);

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

            /**
             * Adds a test using the
             * {{#crossLink "gabarito.TestBuilder"}}{{/crossLink}} within
             * gabarito.
             *
             * @method test
             * @for gabarito.Gabarito
             *
             * @param {string} [name] The test's name
             * @return {gabarito.TestBuilder}
             */
            test: function (name) {
                var test = { name: name };
                var builder = new TestBuilder(test);
                this.add(test);
                return builder;
            },

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
            reset: function () {
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
             * current clause and also passes the parameters along to the given
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
                    var testNames = parts.map(
                            this[tests],
                            function (t) { return test.name; });

                    this[emit]("init", testNames);
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
            }),

            /**
             * Reference containing the various assert utils.
             *
             * @property assert
             * @for gabarito.Gabarito
             * @type {gabarito.Assert}
             */
            assert: assert,

            /**
             * Creates an instance of
             * {{#crossLink "gabarito.Spy"}}{{/crossLink}}
             *
             * @method spy
             * @for gabarito.Gabarito
             *
             * @param {function} fn Function to spy on
             * @return {function} The spy handler function
             */
            spy: Spy.on,

            /**
             * Creates a custom matcher using the function as a matching
             * criteria.
             *
             * The function will receive a value to examinate and should return
             * a boolean indicating whether the criteria is met.
             *
             * @method matcher
             * @for gabarito.Gabarito
             *
             * @param {function} fn The matcher function
             * @return {gabarito.Matcher}
             */
            matcher: matcher
        });
    });

    var gabarito = new Gabarito();

    if (node) {
        module.exports = gabarito;
        gabarito.plumbing = require("./plumbing");
    } else {
        main.gabarito = gabarito;
        gabarito.parts = parts;
    }

}(typeof exports !== "undefined" && global.exports !== exports));

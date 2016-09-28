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

    /**
     * The Assert class provides the various assertions used within tests.
     *
     * @class gabarito.Assert
     * @constructor
     *
     * @param {parts::Parts} [parts]
     */
    var Assert = ilk(parts.overload(
        function () {
            Assert.call(this, parts);
        },
        function (parts) {

            var test = function (m, f) {
                var l = f.length + 1;

                return parts.args(function (args) {
                    var msg = args.length === l? args.pop(): m;
                    if (!f.apply(null, args)) {
                        throw new Error(parts.format(msg, args));
                    }
                });
            };

            var sameAsNull = parts.sameAs(null);
            var sameAsUndefined = parts.sameAs(undefined);
            var hasProperty = function (o, p) { return p in o; };

            parts.merge(this, {

                /**
                 * Asserts that both values are the same (using ===)
                 *
                 * @method areSame
                 * @for gabarito.Assert
                 *
                 * @param {mixed} a A value
                 * @param {mixed} b Another value
                 */
                areSame: test(
                    "Values are not the same.\nExpected: $s\nActual: $s",
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
                areNotSame: test("Values are the same.\nValue: $s",
                    function (a, b) { return a !== b; }),

                /**
                 * Asserts that both values are equal (using parts.Parts/equals
                 * method).
                 *
                 * @method areEqual
                 * @for gabarito.Assert
                 *
                 * @param {mixed} a A value
                 * @param {mixed} b A another value
                 */

                /**
                 * Asserts that both values are equals by using the passed
                 * equality function.
                 *
                 * The equality function will receive both values as arguments
                 * and it must returns true if the values are considered equal.
                 *
                 * @method areEqual
                 * @for gabarito.Assert
                 *
                 * @param {mixed} a A value
                 * @param {mixed} b Another value
                 * @param {function} equality The equality function
                 */

                /**
                 * Asserts that both values are equal (using parts.Parts/equals
                 * method).
                 *
                 * @method areEqual
                 * @for gabarito.Assert
                 *
                 * @param {mixed} a A value
                 * @param {mixed} b Another value
                 * @param {string} msg The error message
                 */

                /**
                 * Asserts that both values are equals by using the passed
                 * equality function.
                 *
                 * The equality function will receive both values as arguments
                 * and it must returns true if the values are considered equal.
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
                    case 2: return this.areEqual(a, b, parts.equals);
                    case 3: return parts.isFunction(equality)?
                            this.areEqual(a, b, equality,
                                "Values should be equal.\nExpected: $s\n" +
                                "Actual: $s"):
                            this.areEqual(a, b, parts.equals, equality);
                    default:
                        if (!equality(a, b)) {
                            throw new Error(parts.format(msg, [a, b]));
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
                isFunction: test("Value should be a function.",
                    parts.isFunction),

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
                isRegExp: test("Value should be a RegExp instance.",
                    parts.isRegExp),

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
                 * Note that the value should be the actual NaN and not
                 * something that converts to NaN.
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
                 * Note that the value should be the actual NaN and not
                 * something that converts to NaN.
                 *
                 * @method isNotNaN
                 * @for gabarito.Assert
                 *
                 * @param {mixed} v Value
                 * @param {string} [msg] The error message
                 */
                isNotNaN: test("Value should not be NaN.",
                    parts.negate(parts.isNaN)),

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
                isNotNull: test("Value should not be null.",
                    parts.negate(sameAsNull)),

                /**
                 * Asserts that a given value is undefined.
                 *
                 * @method isUndefined
                 * @for gabarito.Assert
                 *
                 * @param {mixed} v Value
                 * @param {string} [msg] The error message
                 */
                isUndefined: test("Value should be undefined.",
                    sameAsUndefined),

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
                    hasProperty),

                /**
                 * Asserts that a given object doesn't has a property
                 *
                 * @method doesntHasProperty
                 * @for gabarito.Assert
                 *
                 * @param {object} o The object
                 * @param {string} p The property name
                 * @param {string} [msg] The error message
                 */
                doesntHasProperty: test("Object shouldn't have the property",
                        parts.negate(hasProperty)),

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
                hop: test(
                    "Object shouldn own the property.\n" +
                    "Object: $s\n" +
                    "Property: $s",
                    parts.hop),

                /**
                 * Asserts that a given object doesn't own a property
                 *
                 * @method dhop
                 * @for gabarito.Assert
                 *
                 * @param {object} o The object
                 * @param {string} p The property name
                 * @param {string} [msg] The error message
                 */
                dhop: test(
                    "Object shouldn't own the property.\n" +
                    "Object: $s\n" +
                    "Property: $s",
                        parts.negate(parts.hop)),

                /**
                 * A nice helper to use asserts in a more expressive way. It has
                 *  all the methods from the assert itself.
                 *
                 * Usage:
                 * ```
                 * assert.that(someValue).isEqualTo("3");
                 * ```
                 * @method that
                 * @for gabarito.Assert
                 *
                 * @param {mixed} value
                 * @return {gabarito.AssertThat}
                 */
                that: function (v) {
                    return new AssertThat(this, v);
                }

            });
        }));

    var AssertThat = ilk.tokens(function (assert, value) {
        /**
         * A nice helper to use asserts in a more expressive way. It has all
         * the methods from the {{#crossLink "gabarito.Assert"}}{{/crossLink}}.
         *
         * @class gabarito.AssertThat
         * @constructor
         *
         * @param {gabarito.Assert} assert
         * @param {mixed} value
         */
        return ilk(parts.that(function (that, assert, value) {

            parts.merge(this, {
                /**
                 * Asserts that a given collection has a given number of
                 * elements
                 *
                 * @method hasSizeOf
                 * @for gabarito.AssertThat
                 *
                 * @param {number} size The given size
                 * @param {string} [msg] The error message
                 */
                hasSizeOf: parts.overload(
                    function (size) {
                        this.hasSizeOf(size,
                                "Size mismatch, expected %s elements " +
                                "but collection has %s");
                    },
                    function (size, msg) {
                        assert.areSame(size, value.length, msg);
                    })
            });

            parts.forEach(assert, function (v, p) {
                if (p !== "that") {

                    var name =
                        p === "areSame"? "sameAs":
                        p === "areNotSame"? "notTheSameAs":
                        p === "areEqual"? "isEqualTo":
                        p;

                    that[name] =
                        ["areNotSame", "areSame", "areEqual"].indexOf(p) > -1?
                        parts.args(function (args) {
                            return assert[p].apply(assert,
                                    [args[0], value].concat(args.slice(1)));
                        }):
                        parts.args(function (args) {
                            return assert[p].apply(assert,
                               [value].concat(args));
                        });
                }
            });

        }));

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
                    "Value mismatch.\nValue: $1");
            },

            function (matcher, pMsg) {
                msg.mark(this, pMsg);

                /**
                 * The matcher method should evaluate the matcher function and
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
             * @param {mixed} value
             * @param {number} [position]
             * @return {Error}
             */
            error: function (value, position) {
                return new Error(
                    arguments.length > 1?
                    parts.format(this[msg], [value, ordinal(position)]):
                    parts.format(this[msg], [value]));
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
    var VarargsMatcher = Matcher.descend(parts.overload(
        function (matcher) {
            VarargsMatcher.call(this, matcher,
                    "Varargs mismatch.\nVarargs: $s");
        },
        function (matcher, msg) {
            Matcher.call(this, matcher, msg);
        }));

    var matcher = parts.args(function (args) {
        return parts.applyNew(Matcher, args);
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
                "%2 argument mismatch, it should be a string."),

        /**
         * Matcher for array type
         *
         * @property matcher.ARRAY
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        ARRAY: new Matcher(parts.isArray,
                "%2 argument mismatch, it should be an array."),

        /**
         * Matcher for function type
         *
         * @property matcher.FUNCTION
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        FUNCTION: new Matcher(parts.isFunction,
                "%2 argument mismatch, it should be a function."),

        /**
         * Matcher for object type
         *
         * @property matcher.OBJECT
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        OBJECT: new Matcher(parts.isObject,
                "%2 argument mismatch, it should be an object."),

        /**
         * Matcher for array type
         *
         * @property matcher.NUMBER
         * @for gabarito.Gabarito
         * @type {gabarito.Matcher}
         */
        NUMBER: new Matcher(parts.isNumber,
                "%2 argument mismatch, it should be a number."),

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
                return matcher.type(type, "Type mismatch.");
            },
            function (type, msg) {
                return new Matcher(function (v) { return v instanceof type; },
                        msg);
            }),

        arg: function (v) {
            return matcher.value(
                v,
                "%2 argument mismatch.\n" +
                "Expected: " + parts.dump(v) + "\n" +
                "Actual: $s");
        },

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
        args: parts.args(function (args) {
            return parts.applyNew(VarargsMatcher, args);
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
         * @param {string} [msg]
         * @return {gabarito.Matcher}
         */
        value: function (v, msg) {
            return new Matcher(
                parts.isArray(v) || (!parts.isFunction(v) && parts.isObject(v))?
                function (o) { return parts.equals(v, o); }:
                function (o) { return v === o; },
                arguments.length > 1?
                msg:
                "Value mismatch.\n" +
                "Expected: " + parts.dump(v) + "\n" +
                "Actual: $1");
        },

        /**
         * Matcher that always passes and stores the passed value for later use.
         *
         * @class gabarito.GrabberMatcher
         * @extends gabarito.Matcher
         * @uses gabarito.Grabber
         */

        /**
         * Returns a matcher that always passes. This matcher stores the value
         * passed to the matcher for further inspection later on.
         *
         * @method matcher.grabber
         * @for gabarito.Gabarito
         *
         * @return {gabarito.GrabberMatcher}
         */
        grabber: function () {
            var m = matcher(function (v) {
                m.grab = parts.constant(v);
                return true;
            });
            m.grab = function () { throw new Error("Unused matcher."); };
            return m;
        },

        /**
         * Matcher that always passes and stores the passed values for later
         * use.
         *
         * @class gabarito.ArgsGrabberMatcher
         * @extends gabarito.VarargsMatcher
         * @uses gabarito.Grabber
         */

        /**
         * Just like the grabber matcher, this matcher that always passes. It
         * stores the values passed to the matcher for further inspection
         * later on.
         *
         * It works as a varargs matcher.
         *
         * @method matcher.argsGrabber
         * @for gabarito.Gabarito
         *
         * @return {gabarito.ArgsGrabberMatcher}
         */
        argsGrabber: function () {
            var m = matcher.args(function (v) {
                m.grab = parts.constant(v);
                return true;
            });
            m.grab = function () { throw new Error("Unused matcher."); };
            return m;
        }

    });

    var Spy = ilk.tokens(function (
        calls,
        call
    ) {

        var nextOrder = (function () {
            var order = -1;
            return function () {
                order += 1;
                return order;
            };
        }());

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

        proto({
            /**
             * Checks if the calls arguments matches with the given matchers
             *
             * @method args
             * @for gabarito.SpyVerifier
             * @chainable
             *
             * @param {gabarito.Matcher|mixed} matchers*
             * @return {gabarito.SpyVerifier}
             */
            args: parts.args(parts.that(function (that, args) {
                var lastArg = args[args.length - 1];
                if (!(lastArg instanceof VarargsMatcher) &&
                        args.length !== this[call].args.length) {
                    throw new Error(parts.format(
                        "Args number mismatch: %s args passed, expected %s.",
                        [this[call].args.length, args.length]));
                }

                parts.forEach(args, function (a, i) {
                    var m = a instanceof Matcher? a: matcher.arg(a);
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
                        throw m.error(that[call].args[i], i + 1);
                    }
                });

                return this;
            })),

            /**
             * Asserts that this call was made before another call
             *
             * @method before
             * @for gabarito.SpyVerifier
             * @chainable
             *
             * @param {gabarito.SpyVerifier} anotherCall
             * @param {string} [msg]
             * @return {gabarito.SpyVerifier}
             */
            before: function (anotherCall, msg) {
                if (anotherCall[call].order < this[call].order) {
                    throw new Error(
                        arguments.length > 1? msg: "Call made after.");
                }

                return this;
            },

            /**
             * Asserts that this call was made after another call
             *
             * @method after
             * @for gabarito.SpyVerifier
             * @chainable
             *
             * @param {gabarito.SpyVerifier} anotherCall
             * @param {string} [msg]
             * @return {gabarito.SpyVerifier}
             */
            after: function (anotherCall, msg) {
                if (anotherCall[call].order >  this[call].order) {
                    throw new Error(
                        arguments.length > 1? msg: "Call made before.");
                }

                return this;
            },

            /**
             * Checks what has been throw by the call using the matcher o a
             * value matcher.
             *
             * @method withThis
             * @for gabarito.SpyVerifier
             * @chainable
             *
             * @param {gabarito.Matcher|mixed} v
             * @return {gabarito.SpyVerifier}
             */
            withThis: function (v) {
                var m = v instanceof Matcher? v:
                        new Matcher(
                            parts.sameAs(v),
                            "This mismatch.\nThis: $s");
                var t = this[call].that;

                if (!m.matches(t)) {
                    throw m.error(t);
                }

                return this;
            },

            /**
             * Checks what has been throw by the call using the matcher o a
             * value matcher.
             *
             * @method throwing
             * @for gabarito.SpyVerifier
             * @chainable
             *
             * @param {gabarito.Matcher|mixed} v
             * @return {gabarito.SpyVerifier}
             */
            throwing: function (v) {
                var m, t;

                if (!parts.hop(this[call], "thrown")) {
                    throw new Error("Error not thrown.");
                }

                m = v instanceof Matcher? v:
                    new Matcher(parts.sameAs(v), "Error mismatch.\nError: $s");
                t = this[call].thrown;

                if (!m.matches(t)) {
                    throw m.error(t);
                }

                return this;
            },

            /**
             * Checks what has been returmed by the call using the matcher o a
             * value matcher.
             *
             * @method returning
             * @for gabarito.SpyVerifier
             * @chainable
             *
             * @param {gabarito.Matcher|mixed} v
             * @return {gabarito.SpyVerifier}
             */
            returning: function (v) {
                var m, r;

                if (!parts.hop(this[call], "returning")) {
                    throw new Error("Didn't return.");
                }

                m = v instanceof Matcher? v:
                    matcher.value(v, "Return mismatch.\nReturn: $s");

                r = this[call].returning;

                if (!m.matches(r)) {
                    throw m.error(r);
                }

                return this;
            }
        });

        /**
         * The spy relays the calls to the actual function, but records every
         * call, along with its parameters, its return or error if thrown.
         *
         * To verify a given call, the
         * {{#crossLink "gabarito.SpyVerifier"}}{{/crossLink}} may be obtained
         * through the verify method.
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
                    args: args,
                    order: nextOrder()
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
             * @param {string} [msg]
             *
             * @return {gabarito.SpyVerifier}
             */
            this.handler.verify = function (msg) {
                return arguments.length > 0?
                    that.verify(msg):
                    that.verify();
            };

            /**
             * Relays the noCalls call to the spy instance.
             *
             * @method handler.noCalls
             * @for gabarito.Spy
             *
             * @param {string} [msg]
             */
            this.handler.noCalls = function (msg) {
                if (arguments.length === 0) {
                    that.noCalls();
                } else {
                    that.noCalls(msg);
                }
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
             * @param {string} [msg]
             * @return {gabarito.SpyVerifier}
             */
            verify: function (msg) {

                if (this[calls].length === 0) {
                    throw new Error(
                        arguments.length > 0? msg: "No calls were made.");
                }

                return new SpyVerifier(this[calls].shift());
            },

            /**
             * Throws an error if a call was made
             *
             * @method noCalls
             * @for gabarito.Spy
             *
             * @param {string} [msg]
             */
            noCalls: function (msg) {
                if (this[calls].length !== 0) {
                    throw new Error(
                        arguments.length > 0? msg: "A call was made.");
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


    /**
     * @class gabarito.Gabarito
     * @constructor
     */
    var Gabarito = ilk.tokens(function (
        tests,
        results,
        currentResult,
        listeners,
        preparing,
        onPrepare,

        run,
        onError,
        verifyTest,
        nextClause,
        verifyClause,
        nextTest,
        emit
    ) {
        var privateProperties = [
            tests,
            currentResult,
            listeners,
            preparing,
            onPrepare
        ];

        /**
         * The context class is passed to each clause when it is run, also to
         * the before and after functions.
         *
         * It provides means to run tests asynchronously through the
         * {{#crossLink "gabarito.Context/stay"}}{{/crossLink}},
         * {{#crossLink "gabarito.Context/go"}}{{/crossLink}} and
         * {{#crossLink "gabarito.Context/going"}}{{/crossLink}} methods.
         *
         * @class gabarito.Context
         * @constructor
         */
        var Context = ilk.tokens(function (
            waitingTimeout,
            state,
            withinBlock,
            onErrorListener,
            onResume,

            runBlock,
            error
        ) {
            var IDLE = 0;
            var RUNNING = 1;
            var WAITING = 2;
            var FINISHED = 3;

            return ilk(parts.that(function (that) {
                waitingTimeout.mark(this);
                onErrorListener.mark(this, parts.k);
                state.mark(this, IDLE);
                onResume.mark(this);
                withinBlock.mark(this, false);
            })).

            proto(onError, function (listener) {
                this[onErrorListener] = listener;
                return this;
            }).

            proto(error, function (error) {
                var e = new Error(error);
                if (this[withinBlock]) {
                    throw e;
                } else {
                    this[onErrorListener].call(null, e);
                }
            }).

            proto(run, parts.that(function (that, block, done) {
                var results = { start: parts.now() };

                that[runBlock](function () { block(that); }, function (error) {
                    results.elapsedTime = parts.now() - results.start;

                    if (error) {
                        results.error = error;
                    }

                    that[state] = FINISHED;
                    done(results);
                });
            })).

            proto(runBlock, parts.that(function (that, block, done) {
                this[state] = RUNNING;
                this[withinBlock] = true;
                var error;
                try {
                    block(this);
                } catch (e) {
                    error = e;
                }
                this[withinBlock] = false;

                if (error) {
                    done(error);
                } else if (this[state] !== WAITING) {
                    done();
                } else {
                    this[onResume] = function (block) {
                            that[runBlock](block, done); };
                }
            })).

            proto({
                /**
                 * Tells the context to wait for an async continuation.
                 *
                 * @method stay
                 * @for gabarito.Context
                 *
                 * @param {number} [timeout] Timeout before it breaks
                 *                           (defaults to 10000);
                 */
                stay: parts.that(function (that, timeout) {
                    if (this[state] === FINISHED) {
                        this[error]("Context has already run.");
                    } else if (this[state] === WAITING) {
                        this[error]("Already waiting.");
                    } else {
                        this[state] = WAITING;
                        this[waitingTimeout] = setTimeout(function () {
                            if (that[state] === WAITING) {
                                that.go(function () {
                                    that[error]("Timeout reached.");
                                });
                            }
                        }, timeout || 10000);
                    }
                }),

                /**
                 * Tells the context to resume
                 *
                 * @method go
                 * @for gabarito.Context
                 *
                 * @param {function} [block]
                 */
                go: function (block) {
                    if (this[state] === FINISHED) {
                        this[error]("Context has already run.");
                    } else if (this[state] !== WAITING) {
                        this[error]("Go called without stay.");
                    } else {
                        clearTimeout(this[waitingTimeout]);
                        this[onResume](block || parts.k);
                    }
                },

                /**
                 * Returns a function that when called, tells the context to
                 * resume the current clause and also passes the parameters
                 * along to the given function.
                 *
                 * Just a syntatic sugar to avoid another nesting level.
                 *
                 * @method going
                 * @for gabarito.Context
                 *
                 * @param {function} [block]
                 */
                going: parts.that(function (that, block) {
                    return parts.args(parts.that(function (myThis, args) {
                        parts.work(function () {
                            that.go(function () { (block || parts.k).
                                apply(myThis, args); });
                        });
                    }));
                })
            });
        });

        return ilk(parts.that(function (t) {
            parts.forEach(privateProperties, function (p) { p.mark(t); });

            this.reset();
        })).

        constant("standalone", function () {
            return new Gabarito();
        }).

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
                this[verifyClause](test, clause, function (result) {
                    that[currentResult].results[clause] = result;
                    that[nextClause](test, clauses, done);
                });
            } else {
                done();
            }
        })).

        proto(verifyClause, parts.that(function (that, test, clause, done) {
            var emitError = function (e) { that[emit]("error", e); };

            var finish = function (result) {
                that[emit](result.error? "fail": "pass",
                    test.name, clause, result);

                done(result);
            };

            new Context()
                [onError](emitError)
                [run](test.before || parts.k, function (result) {
                    if (result.error) {
                        return finish(result);
                    }

                    new Context()
                        [onError](emitError)
                        [run](test[clause], function (result) {
                            if (result.error) {
                                return finish(result);
                            }

                            new Context()
                                [onError](emitError)
                                [run](test.after || parts.k, function (after) {
                                    finish(after.error? after: result);
                                });
                        });
                });
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
                this[currentResult] = undefined;
                this[listeners] = {
                    "init": [],
                    "begin": [],
                    "enter": [],
                    "end": [],
                    "pass": [],
                    "fail": [],
                    "complete": [],
                    "say": [],
                    "error": []
                };
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
             * The test is an object containing various methods. Each method
             * is treated as a test clause. Every draft is run to check if it
             * works.
             *
             * @method add
             * @for gabarito.Gabarito
             *
             * @param {object} test The test itself
             */
            add: function (test) {
                this[tests].push(test);
            },

            /**
             * Register an event listener for a given event.
             *
             * Available events:
             *
             * - init: The initialization of the gabarito verification.
             * - begin: The beginning of a test verification.
             * - enter: When gabarito is about to enter into a clause
             * verification.
             * - pass: Whenever a clause passes.
             * - fail: Whenever a clause fails.
             * - end: When a test verification has ended.
             * - complete: When all the test verifications have completed.
             * - say: Custom event to emit whatever message.
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
             * Removes an event listener for a given event.
             *
             * @param {string} event
             * @param {functin} listener
             */
            removeListener: function (event, listener) {
                var map = this[listeners];
                if (!(event in map)) {
                    throw new TypeError("Unknown event: " + event);
                }

                var list = map[event];
                var index = parts.indexOf(list, listener);
                if (index !== undefined) {
                    map[event] = list.slice(0, index).
                            concat(list.slice(index + 1));
                }
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
                            function (t) { return t.name; });

                    this[emit]("init", testNames);
                    this[nextTest](this[tests].slice(), function () {
                        var doneResults = that[results];
                        that[emit]("complete", doneResults);
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
            assert: new Assert(),

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

    parts.merge(gabarito, {
        Assert: Assert,
        AssertThat: AssertThat
    });

    if (node) {
        module.exports = gabarito;
        gabarito.plumbing = require("./plumbing");
    } else {
        main.gabarito = gabarito;
        gabarito.parts = parts;
    }

}(typeof exports !== "undefined" && global.exports !== exports));

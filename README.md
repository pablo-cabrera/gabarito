gabarito [![Build Status](https://travis-ci.org/pablo-cabrera/gabarito.png)](https://travis-ci.org/pablo-cabrera/gabarito)
========

Gabarito is a javascript testing framework intended for use in both browser and node-js environments. It brings some characteristics from various xUnit tests framework as well as some ideas from [YUITest](http://yuilibrary.com/yui/docs/test/) framekwork.

### TL;DR

Writing a test file.

```js
// test.js

var isNode = typeof exports !== "undefined" && global.exports !== exports;
var gabarito = isNode? require("gabarito"): window.gabarito;
var assert = gabarito.assert;

var test = {

    // the test name
    name: "some test",

    // runs before every test clause
    before: function () {
    },

    // runs after every test clause
    after: function () {
    },

    // every other function property is a test clause...

    "a test clause": function () {
        assert.isTrue(true);
    },

    anotherTestClause: function () {
        assert.isFalse(false);
    },

    failingTestClause: function () {
        throw new Error("Just throw an error");
    }

};

// adds the test into gabarito
gabarito.add(test);

// tells gabarito to verify added tests
gabarito.verify();
```

The test runner.

```js
// runner.js

var gabarito = require("gabarito");
var runner = new gabarito.plumbing.Runner();

// files loaded for the test to be run
runner.addFile("./test.js");

// console reporter so we see things happening on the console output
runner.addReporter(new gabarito.plumbing.ConsoleReporter());

// junit reporter so we have a nice junit-xml to integrate with our favorite CI
runner.addReporter(new gabarito.plumbing.JUnitXmlReporter("results.xml"));

// environments in which the tests will be run
runner.addEnvironment(new gabarito.plumbing.NodeEnvironment());
runner.addEnvironment(new gabarito.plumbing.PhantomEnvironment());

// run load files and environments and runs the tests
runner.run(function (results) {
    console.log(results);
});
```

Running.

```bash
$ node runner.js
```

### Async testing

Gabarito passes a **[context](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Context.html)** object for every test. To tell gabarito to wait for an async continuation, the `stay` method should be called (with an optional timeout value). In order to continue the test, the `go` must be called. One also may use the `going` method which wraps the callback function calling the `go` method internally.

```js
var test = {
    name: "async test",

    "an async test": function (context) {
        var callback = function (result) {
            context.go(function () {
                assert.isObject(result);
            });
        };

        doSomethingAsync(callback);
        context.stay();
    },

    "another async test": function (context) {
        var callback = context.going(function (result) {
            assert.isObject(result);
        });

        doSomethingAsync(callback);
        context.stay();
    }
};
```

The `before` and `after` methods also receives the **context** object in order to do some async preparations.

## Asserts

Gabarito comes with a built-in assertion library. The full documentation can be seen on the API-Docs for [assert](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Assert.html) and [assert that](http://pablo-cabrera.github.io/gabarito/classes/gabarito.AssertThat.html).

```js
// classic style
assert.areEqual("a", someVar);

// that style
assert.that(someVar).isEqualTo("a");
```

### Spying

Gabarito also comes with a built-in spy library. It helps to verify method calls checking it's behavior and values.

```js
var divide = gabarito.spy(function (a, b) {
    if (b === 0) {
        throw new TypeError("Cannot divide by 0");
    }

    return a / b;
});

divide(4, 2);

divide.
    verify().
    args(4, 2).
    returning(2);
// passes

divide(4, 2);

divide.
    verify()
    args(3, 1);
// throws
```

If you pass values to the [args](http://pablo-cabrera.github.io/gabarito/classes/gabarito.SpyVerifier.html#methods_args)/[returning](http://pablo-cabrera.github.io/gabarito/classes/gabarito.SpyVerifier.html#methods_returning)/[throwing](http://pablo-cabrera.github.io/gabarito/classes/gabarito.SpyVerifier.html#methods_returning)/[withThis](http://pablo-cabrera.github.io/gabarito/classes/gabarito.SpyVerifier.html#methods_withThis), a [value matcher](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#methods_matcher.value) will be used.

There are a few built-in matchers to be used: [ANY](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#props_matcher.ANY), [ANY_ARGS](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#props_matcher.ANY_ARGS), [ARRAY](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#props_matcher.ARRAY), [FUNCTION](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#props_matcher.FUNCTION), [NUMBER](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#props_matcher.NUMBER), [OBJECT](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#props_matcher.OBJECT)

```js
divide.
    verify().
    args(gabarito.matcher.NUMBER, gabarito.matcher.NUMBER).
    withThis(gabarito.matcher.ANY).
    returning(gabarito.matcher.NUMBER);
```

For custom type matchers, the [type matcher](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#methods_matcher.type) may be used to check for types.

```js
var MyType = function () {};
someMethod(new MyType());

someMethod.
    verify().
    args(gabarito.matcher.type(MyType));
```

If you need a custom matcher, for... whatever reason, you may build one using the [matcher](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#methods_matcher) method.

```js
divide.
    verify().
    args(
        gabarito.matcher(function (a) { return a === 4; }),
        gabarito.matcher(function (b) { return b === 2; }));
```
Varargs may be checked with the [args matcher](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#methods_matcher.args).

```js
divide.
    verify().
    args(gabarito.matcher.args(function (args) {
        return args[0] === 4 && args[1] === 2;
    });
```

If you need to grab a specific value for futher use, you can use the [grabber matcher](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#methods_matcher.grabber). This matcher always passes.

```
var grabber = gabarito.matcher.grabber();

divide.
    verify().
    args(grabber, gabarito.matcher.ANY);

assert.that(grabber.grab()).isEqualTo(4);
```

For var args, the [args grabber matcher](http://pablo-cabrera.github.io/gabarito/classes/gabarito.Gabarito.html#methods_matcher.argsGrabber) can be used.

```js
var grabber = gabarito.matcher.argsGrabber();

divide.
    verify().
    args(grabber);

assert.that(grabber.grab()).isEqualTo([4, 2]);
```

"use strict";

var parts = require("parts");
var cp = require("child_process");
var url = require("url");
var http = require("http");

var SeleniumEnvironment = require("./SeleniumEnvironment");

var VBoxSeleniumEnvironment = parts.tokens(function (
    myVm,
    myVmAddress,

    startVm,
    stopVm,
    whenVmIsNotRunning,
    whenNodeIsRegistered,
    whenNodeIsNotRegistered,
    tellReporters,
    httpGet,
    registerNode,
    isRegistered,
    unregisterNode,
    parseCapabilities,
    getCapabilities
) {
    var shared = {};

    return SeleniumEnvironment.descend(function (capabilities, hub, host, vm, vmAddress) {
        SeleniumEnvironment.call(this, capabilities, hub, host);

        myVm.mark(this, vm);
        myVmAddress.mark(this, vmAddress);
    }, shared).

    proto(httpGet, parts.that(function (that, url, done) {
        http.get(url, function (res) {

            var data = "";
            res.on("data", function(d) { data += d; });
            res.on("end", function() { done(data); });

        }).on("error", function () {
            setTimeout(function () { that[httpGet](url, done); }, 1000);
        });
    })).

    proto(startVm, parts.that(function (that, reporters, done) {
        this[tellReporters](reporters, "Starting vm...");

        cp.execFile("vboxmanage", ["startvm", that[myVm]], function () {
            that[registerNode](function () {
                that[tellReporters](reporters, "Vm started");
                done();
            });
        });

    })).

    proto(registerNode, parts.that(function (that, done) {
        this[httpGet](
            "http://" + this[myVmAddress] + ":1432/register",
            function () { that[whenNodeIsRegistered](done); });
    })).

    proto(unregisterNode, parts.that(function (that, done) {
        this[httpGet](
            "http://" + this[myVmAddress] + ":1432/unregister",
            function () { that[whenNodeIsNotRegistered](done); });
    })).

    proto(tellReporters, parts.that(function (that, reporters, msg) {
        reporters.forEach(function (r) { r.say(that, msg); });
    })).

    proto(stopVm, parts.that(function (that, reporters, done) {
        this[tellReporters](reporters, "Stopping vm...");

        this[unregisterNode](function () {
            cp.execFile("vboxmanage", ["controlvm", that[myVm], "savestate"],
                    function (error, stdout, stderr) {

                that[whenVmIsNotRunning](function () {
                    that[tellReporters](reporters, "Vm stopped");
                    done();
                });
            });
        });
    })).

    proto(whenVmIsNotRunning, parts.that(function (that, done) {
        cp.execFile("vboxmanage", ["list", "runningvms"],
                function (err, stdout, stderr) {

            if (stdout.indexOf("\"" + that[myVm] + "\"") === -1) {
                done();
            } else {
                setTimeout(function () {
                    that[whenVmIsNotRunning](done);
                }, 500);
            }
        });
    })).

    proto(whenNodeIsRegistered, parts.that(function (that, done) {
        this[isRegistered](function (b) {
            if (b) {
                done();
            } else {
                setTimeout(
                        function () {that[whenNodeIsRegistered](done); },
                        500);
            }
        });
    })).

    proto(whenNodeIsNotRegistered, parts.that(function (that, done) {
        this[isRegistered](function (b) {
            if (b) {
                setTimeout(
                        function () {that[whenNodeIsNotRegistered](done); },
                        500);
            } else {
                done();
            }
        });
    })).

    proto(parseCapabilities, function (str) {
        var capabilities = {};
        str.replace(/title='{([^}]+)}'/, "$1")
                .split(/,\s+/).forEach(function (s) {

            var p = s.split("=");
            capabilities[p[0]] = p[1];
        });

        return capabilities;

    }).

    proto(getCapabilities, parts.that(function (that, done) {
        this[httpGet]("http://" + this[shared.hub] + "/grid/console",
            function (d) {
                var capabilities = (d.match(/title='{[^}]+}'/g) || []).
                        map(function (m) {

                    return that[parseCapabilities](m);
                });

                done(capabilities);
            });
    })).

    proto(isRegistered, parts.that(function (that, done) {
        var browserName = this[shared.capabilities].browserName;
        var version = this[shared.capabilities].version;
        var platform = this[shared.capabilities].platform;

        var matches = function (capabilities) {
            if (capabilities.browserName !== browserName) {
                return false;
            }

            if (version && capabilities.version !== version) {
                return false;
            }

            if (platform && capabilities.platform !== platform) {
                return false;
            }

            return true;
        };

        this[getCapabilities](function (capabilities) {
            done(capabilities.some(matches));
        });
    })).

    proto({
        getName: function () {
            var name = VBoxSeleniumEnvironment.ancestor.getName.call(this);
            return name.substr(0, name.length - 1) + ":" + this[myVm] + "]";
        },
        dispatch: parts.that(function (that, files, reporters, done) {
            this[startVm](reporters, function () {
                VBoxSeleniumEnvironment.ancestor.dispatch.call(that, files, reporters, function (results) {
                    that[stopVm](reporters, function () {
                        done(results);
                    });
                });
            });
        })
    });
});

module.exports = VBoxSeleniumEnvironment;
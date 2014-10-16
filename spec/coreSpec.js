describe("Core suite", function () {
    var stubRenderer = function (data, headers) {
        // I don't do anything!
    };

    it("cabal is defined as function that expects two arguments", function () {
        expect(typeof cabal).toBe('function');
        expect(cabal.length).toBe(2);
    });

    it("VERSION is defined", function () {
        expect(cabal.VERSION).toBeDefined();
    });

    describe("cabal function", function () {
        it("call returns a function that expects two arguments", function () {
            expect(typeof cabal([], [])).toBe('function');
            expect(cabal([], []).length).toBe(2);
        });

        it("call throws exception if called with no arguments", function () {
            expect(cabal).toThrow();
        });

        it("call throws exception if called with one argument", function () {
            var fn = function () {
                cabal([]);
            };
            expect(fn).toThrow();
        });

        it("subsequent calls return new instances", function () {
            var fn1 = cabal([], []);
            fn1.foo = "bar";
            var fn2 = cabal([], []);
            expect(fn2.foo).toBeUndefined();
        });
    });

    describe("Cabal function", function () {
        it("property isPrerendered is initialised to false", function () {
            expect(cabal([], []).isPrerendered).toBeFalsy();
        });

        it("call sets property isPrerendered to true", function () {
            var fn = cabal([], []);
            fn(stubRenderer, []);
            expect(fn.isPrerendered).toBeTruthy();
        });

        it("property isPrerendered can't be set from outside", function () {
            var fn = cabal([], []);
            fn.isPrerendered = true;
            expect(fn.isPrerendered).toBeFalsy();
        });

        it("instances have own isPrerendered", function () {
            var fn = cabal([], []);
            var fn2 = cabal([], []);
            fn(stubRenderer, []);
            expect(fn.isPrerendered).toBeTruthy();
            expect(fn2.isPrerendered).toBeFalsy();
        });

        describe("strict mode", function () {
            'use strict';
            it("trying to set isPrerendered throws", function () {
                var thrower = function (cbl) {
                    cbl.isPrerendered = true;
                };
                var fn = cabal([], []);
                expect(thrower).toThrow();
            });
        });
    });
});

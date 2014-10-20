describe("Core suite", function () {
    var oneRenderObj = {"rendered":[{"ri":0,"pi":0},{"ri":1,"pi":2},{"ri":2,"pi":4},{"ri":3,"pi":1}],"all":{"Title":0,"Customer":1,"DateOfAction":2,"SiteName":3,"ProjectStatus":4}};
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
            expect(fn1.foo).toBeDefined();
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

        xit("preRender is only called once", function () {
            // TODO: input some mappings and data
            var fn = cabal([], []);
            fn(stubRenderer, []);
            var notThrower = function () {
                fn(stubRenderer, [1]);
            };
            expect(notThrower).not.toThrow();
        });
        
        describe("renderObj property", function () {
            it("is undefined before function is called", function () {
                var fn = cabal([], []);
                expect(fn.renderObj).toBeUndefined();
            });

            it("can't be set from outside", function () {
                var fn = cabal([], []);
                fn.renderObj = {foo: 1};
                expect(fn.renderObj).toBeUndefined();
            });

            it("becomes available after function is called", function () {
                var fn = cabal([], []);
                fn(stubRenderer, []);
                expect(fn.renderObj).toBeDefined();
            });

            it("is immutable once set", function () {
                var fn = cabal([], []);
                fn(stubRenderer, []);
                var thrower = function () {
                    fn.renderObj.foo = 1;
                };
                expect(fn.renderObj.foo).toBeUndefined();
            });
        });

        describe("strict mode", function () {
            'use strict';
            it("trying to set isPrerendered throws", function () {
                var fn = cabal([], []);
                var thrower = function () {
                    fn.isPrerendered = true;
                };
                expect(thrower).toThrow();
            });

            it("trying to expand renderObj throws", function () {
                var fn = cabal([], []);
                fn(stubRenderer, []);
                var thrower = function () {
                    fn.renderObj.foo = 1;
                };
                expect(thrower).toThrow();
            });
        });
    });
});

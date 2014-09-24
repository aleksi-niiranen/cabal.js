describe("Utils suite", function () {
    it("mapper function returns a cabal compatible property", function () {
        var property = cabalutils.mapper("foobar");
        expect(property.name).toBe("foobar");
        expect(property.componentType).toBeDefined();
    });

    describe("CabalProperty", function () {
        it("attributes function returns the property", function () {
            var aProperty = cabalutils.mapper("foobar");
            var bProperty = aProperty.attributes({ arg: "baz" });
            expect(bProperty.attr.arg).toBe("baz");
            expect(bProperty).toBe(aProperty);
        });

        it("as function returns the property", function () {
            var aProperty = cabalutils.mapper("foobar");
            var bProperty = aProperty.as("baz");
            expect(bProperty.componentType).toBe("baz");
            expect(bProperty).toBe(aProperty);
        });
    });
});

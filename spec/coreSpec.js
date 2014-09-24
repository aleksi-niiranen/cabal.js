describe("Core suite", function () {
    it("cabal is defined as function", function () {
        expect(typeof cabal).toBe('function');
    });

    it("VERSION is defined", function () {
        expect(cabal.VERSION).toBeDefined();
    });

});

var assert = require("assert");
var expect = require("chai").expect;
var Registry = require("../src/registry");

describe("Registry", function(){

    it("to resolve factory callbacks", function() {
        var registry = new Registry();

        var objectA = {foo: "bar"};

        registry.register("objectA", [], function() {
            return objectA;
        });

        registry.resolve("objectA", function(d) {
            expect(d).to.equal(objectA);
        });
    });

    it("to resolve dependant factory callbacks", function() {
        var registry = new Registry();

        var objectA = {foo: "bar"};
        var objectB = {bar: "foo"};

        registry.register("objectA", [], function() {
            return objectA;
        });

        registry.register("objectB", ["objectA"], function(objectA) {
            objectB.objectA = objectA;
            return objectB;
        });

        registry.resolve("objectB", function(d) {
            expect(d).to.equal(objectB);
            expect(d.objectA).to.equal(objectA);
        });

    });

    it("to resolve unordered dependant factory callbacks", function(done) {
        var registry = new Registry();

        var objectA = {foo: "bar"};
        var objectB = {bar: "foo"};

        registry.register("objectB", ["objectA"], function(objectA) {
            objectB.objectA = objectA;
            return objectB;
        });

        registry.resolve("objectB", function(d) {
            expect(d).to.equal(objectB);
            expect(d.objectA).to.equal(objectA);
            done();
        });

        registry.register("objectA", [], function() {
            return objectA;
        });

    });

    describe("#register()", function(){
        it("throw errors on wrong parameters", function() {
            var registry = new Registry();

            expect(registry.register.bind(registry, null, null, null)).to.throw("First argument must be a string.");
            expect(registry.register.bind(registry, "name", null, null)).to.throw("Second argument must be an array.");
            expect(registry.register.bind(registry, "name", [], null)).to.throw("Third argument must be a factory function.");
        });
    });
});
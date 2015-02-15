var nodeInjection = require("../../");

var App = function(ni) {
    this._ni = ni;
};

App.prototype.service = function(name, factory) {
    if(arguments.length < 2) {
        throw new Error("You must provide at least two parameters, a name and a factory function.");
    }else{
        if(typeof (arguments[0]) !== 'string') {
            throw new Error("First parameter must be a string");
        }

        if(typeof (arguments[arguments.length - 1]) !== 'function') {
            throw new Error("Last parameter must be a factory function");
        }
    }

    factory = arguments[arguments.length - 1];
    var dependencies = Array.prototype.splice.call(arguments, 1, arguments.length - 2);

    this._ni.registry.register(name,  dependencies, factory);
};

App.prototype.controller = function(factory) {
    var dependencies = Array.prototype.splice.call(arguments, 0, arguments.length - 1);
    this._ni.compose(dependencies, factory);
};

nodeInjection(function(ni) {

    ni.addPath(__dirname, "controller");
    ni.addPath(__dirname, "service");

    return new App(ni);
});
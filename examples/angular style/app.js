var nodeInjection = require("../../");

/**
 * Creates a new App object
 * @param {NodeInjection} ni
 * @constructor
 */
var App = function(ni) {
    this._ni = ni;
};

/**
 * Register a service
 * @param {string} name
 * @param {...string} dependency
 * @param {function} factory
 */
App.prototype.service = function(name, dependency, factory) {
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

    this._ni.registry.register(name, dependencies, factory);
};

/**
 * Build a controller
 * @param {...string} dependency
 * @param {function} factory
 */
App.prototype.controller = function(dependency, factory) {
    var dependencies = Array.prototype.splice.call(arguments, 0, arguments.length - 1);
    factory = arguments[arguments.length - 1];
    if(typeof (factory) !== 'function') {
        throw new Error("Last parameter must be a factory function");
    }

    this._ni.compose(dependencies, factory);
};

// ----- method overrides -----

/**
 * Overrides NI's file loading behaviour
 * @param {string} path
 */
App.prototype.loadFile = function(path) {
    console.log('loading', path);
    require(path)(this);
};

nodeInjection(function(ni) {

    ni.registry.loadCoreModules();
    ni.addPath(__dirname, "controller");
    ni.addPath(__dirname, "service");

    return new App(ni);
});
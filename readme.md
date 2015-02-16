#nodeInjection
lightweight helper to create your own node.js dependency injection.
It resolves dependencies only on-demand and asynchronously.

##Initialization

```js
//require and initialize
require('nodeinjection')(function(ni) {

	//load all node.js core modules as dependencies
    ni.registry.loadCoreModules();

    //add paths ni should initialize for you
    ni.addPath(__dirname, "controller");
    ni.addPath(__dirname, "service");

    //the object returned in this function will be your "application" object
    return new App(ni);
});
```

##Application object overrides

You can override behaviour by defining certain methods in the application object you provide during initialization

method        | parameters     | returns | description
------------- | -------------- | ------- | ----------
loadFile      | path (string)  | void    | gets called whenever a file should be loaded. If you define this method, you have to do the loading yourself.


##Application object example

Here is an example how to get angular-style dependency injection

```js
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
    if(typeof (arguments[arguments.length - 1]) !== 'function') {
        throw new Error("Last parameter must be a factory function");
    }

    var dependencies = Array.prototype.splice.call(arguments, 0, arguments.length - 1);
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
```

##Your code files

NI then assumes each file in your specified paths returns a closure like shown below and provides you with your app object. You can override this behaviour by defining an _loadFile_ method in your application object (see overrides).

```js
module.exports = function(app) {

};
```

you can find more examples in the examples folder.

##Licence
MIT
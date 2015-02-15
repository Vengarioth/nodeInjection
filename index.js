var path = require('path'),
    fs = require('fs'),
    Registry = require('./src/registry');

var NodeInjection = function() {
    this.registry = new Registry();

    this._paths = [];
    this._app = null;

    this._initialized = false;
};

NodeInjection.prototype._initialize = function(app) {
    if(typeof (app) !== "object") throw new Error("App must be an object.");
    if(this._initialized) throw new Error("NodeInjection already initialized.");

    this._app = app;

    for(var i = 0; i < this._paths.length; i++) {
        this._initializeRecursive(this._paths[i]);
    }
};

NodeInjection.prototype._initializeRecursive = function(pathToInitialize) {
    var that = this;

    fs.readdir(pathToInitialize, function(err, files) {
        files.forEach(function(file) {
            var newPath = path.join(pathToInitialize, file);

            var stat = fs.statSync(newPath);
            if(stat.isDirectory()) {
                that._initializeRecursive(newPath);

            }else if(stat.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(file)) {
                    require(newPath)(that._app);
                }
            }
        });
    });
};

NodeInjection.prototype.addPath = function(pathToAdd) {

    for(var i = 0; i < arguments.length; i++) {
        if(typeof (arguments[i]) !== 'string')
            throw new Error("argument [" + i + "] must be a string.");
    }

    if(arguments.length > 1) {
        pathToAdd = Array.prototype.join.call(arguments, path.sep);
    }

    if(this._paths.indexOf(pathToAdd) >= 0) throw new Error("The resulting path " + pathToAdd + " has already been added.");

    this._paths.push(pathToAdd);
};

NodeInjection.prototype.compose = function(dependencies, factory) {
    this.registry.resolveMultiple(dependencies, function(resolvedDependencies) {
        factory.apply(null, resolvedDependencies);
    });
};

module.exports = function(callback) {
    var ni = new NodeInjection();
    ni._initialize(callback(ni));
};
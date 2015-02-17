var RegistryEntry = require('./RegistryEntry');

var Registry = function() {
    this._map = [];
    this._coreModulesLoaded = false;
};

/**
 * Loads all node.js core modules into the registry
 */
Registry.prototype.loadCoreModules = function() {
    require('./coreModules')(this);
};

Registry.prototype.register = function(name, dependencies, factory) {
    if(typeof (name) !== 'string') throw new Error("First argument must be a string.");
    if(!Array.isArray(dependencies)) throw new Error("Second argument must be an array.");
    if(typeof (factory) !== 'function') throw new Error("Third argument must be a factory function.");

    var entry;
    if(this._map[name] != null) {
        entry = this._map[name];

        if(entry.isResolving || entry.isResolved) {
            throw new Error(name + " is already registered.");
        }

        entry.dependencies = dependencies;
        entry.factory = factory;
        entry.isResolving = true;

        this._resolveEntry(entry);
    }else{
        entry = new RegistryEntry();

        entry.name = name;
        entry.dependencies = dependencies;
        entry.factory = factory;

        this._map[name] = entry;
    }
};

Registry.prototype.resolve = function(name, callback) {
    if(typeof (name) !== 'string') throw new Error("First argument must be a string.");
    if(typeof (callback) !== 'function') throw new Error("Second argument must be a callback function.");

    var entry = this._map[name];

    if(!entry) {
        entry = new RegistryEntry();
        entry.name = name;
        entry.onResolve(callback);
        this._map[name] = entry;
        return;
    }

    if(entry.isResolved) {
        callback(entry.resolvedObject, entry);
        return;
    }

    entry.onResolve(callback);

    if(entry.isResolving) {
        return;
    }

    this._resolveEntry(entry);
};

Registry.prototype.resolveMultiple = function(names, callback) {
    var resolvedObjects = [];
    var resolvedObjectCount = 0;

    for(var i = 0; i < names.length; i++) {
        this.resolve(names[i], function(resolvedDependency, entry) {
            resolvedObjects[names.indexOf(entry.name)] = resolvedDependency;
            resolvedObjectCount++;

            if(resolvedObjectCount === names.length) {
                callback(resolvedObjects);
            }
        });
    }
};

Registry.prototype._resolveEntry = function(entry) {
    entry.isResolving = true;

    if(entry.dependencies.length < 1) {

        try {
            var resolvedObject = entry.factory();
        }catch (e) {
            throw new Error("execution of factory \"" + entry.name + "\" threw an Error.", e);
        }

        if(typeof(resolvedObject) === 'undefined' || resolvedObject === null)
            throw new Error("factory \"" + entry.name + "\" returned null or undefined.");

        entry.resolve(resolvedObject);
    }else{
        this.resolveMultiple(entry.dependencies, function(resolvedDependencies) {
            try {
                var resolvedObject = entry.factory.apply(null, resolvedDependencies);
            }catch (e) {
                throw new Error("execution of factory \"" + entry.name + "\" threw an Error.", e);
            }

            if(typeof(resolvedObject) === 'undefined' || resolvedObject === null)
                throw new Error("factory \"" + entry.name + "\" returned null or undefined.");

            entry.resolve(resolvedObject);
        });
    }
};

module.exports = Registry;
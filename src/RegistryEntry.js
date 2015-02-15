/**
 * Creates a new RegistryEntry
 * @constructor
 */
var RegistryEntry = function() {
    this.name = '';
    this.dependencies = [];
    this.factory = null;

    this.isResolved = false;
    this.resolvedObject = null;

    this.isResolving = false;
    this.resolvedCallbacks = [];
};

/**
 * register a resolve callback
 * @param callback
 */
RegistryEntry.prototype.onResolve = function(callback) {
    if(typeof (callback) !== 'function') throw new Error("First argument must be a callback function.");

    if(this.isResolved) {
        callback(this.resolvedObject, this);
        return;
    }

    this.resolvedCallbacks.push(callback);
};

/**
 * Resolves this RegistryEntry
 * @param resolvedObject
 */
RegistryEntry.prototype.resolve = function(resolvedObject) {
    if(this.isResolved) throw new Error("RegistryEntry already resolved");
    if(!this.isResolving) throw new Error("RegistryEntry was not resolving");


    this.resolvedObject = resolvedObject;
    this.isResolving = false;
    this.isResolved = true;

    for(var i = 0; i < this.resolvedCallbacks.length; i++) {
        this.resolvedCallbacks[i](resolvedObject, this);
    }
};

module.exports = RegistryEntry;
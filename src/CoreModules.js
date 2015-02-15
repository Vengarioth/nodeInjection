module.exports = function(registry) {
    
    registry.register('assert', [], function() { return require('assert'); });
    registry.register('buffer', [], function() { return require('buffer'); });
    registry.register('child_process', [], function() { return require('child_process'); });
    registry.register('cluster', [], function() { return require('cluster'); });
    registry.register('console', [], function() { return require('console'); });
    registry.register('constants', [], function() { return require('constants'); });
    registry.register('crypto', [], function() { return require('crypto'); });
    registry.register('dgram', [], function() { return require('dgram'); });
    registry.register('dns', [], function() { return require('dns'); });
    registry.register('domain', [], function() { return require('domain'); });
    registry.register('events', [], function() { return require('events'); });
    registry.register('freelist', [], function() { return require('freelist'); });
    registry.register('fs', [], function() { return require('fs'); });
    registry.register('http', [], function() { return require('http'); });
    registry.register('https', [], function() { return require('https'); });
    registry.register('module', [], function() { return require('module'); });
    registry.register('net', [], function() { return require('net'); });
    registry.register('os', [], function() { return require('os'); });
    registry.register('path', [], function() { return require('path'); });
    registry.register('punycode', [], function() { return require('punycode'); });
    registry.register('querystring', [], function() { return require('querystring'); });
    registry.register('readline', [], function() { return require('readline'); });
    registry.register('repl', [], function() { return require('repl'); });
    registry.register('smalloc', [], function() { return require('smalloc'); });
    registry.register('stream', [], function() { return require('stream'); });
    registry.register('string_decoder', [], function() { return require('string_decoder'); });
    registry.register('sys', [], function() { return require('sys'); });
    registry.register('timers', [], function() { return require('timers'); });
    registry.register('tls', [], function() { return require('tls'); });
    registry.register('tty', [], function() { return require('tty'); });
    registry.register('url', [], function() { return require('url'); });
    registry.register('util', [], function() { return require('util'); });
    registry.register('vm', [], function() { return require('vm'); });
    registry.register('zlib', [], function() { return require('zlib'); });

};
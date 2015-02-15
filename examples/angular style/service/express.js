var express = require("express");

module.exports = function(app) {

    app.service("express", function() {
        var app = express();

        var server = app.listen(3000, function () {
            var port = server.address().port;

            console.log("Example app listening on port %s",  port);
        });

        return app;
    });

};
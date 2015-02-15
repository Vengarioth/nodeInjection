module.exports = function(app) {

    app.controller("express", function(express) {

        express.get('/', function(req, res) {
            res.send('Hello World!');
        });

    });

};
//Dependency
var path = require('path');

module.exports = function(app) {
    //Route to index.html
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // //Route to comment page
    // app.get('/article/:id', function(req, res) {
    //     res.sendFile(path.join(__dirname, '../public/article.html'))
    // });
};

//Require models
var db = require('../models');
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    //Scrape and display Headline, Summary, URL... (other content is optional- photos, bylines, etc)
    app.get('/scrape', function(req, res) {
        //grab the body of the html with axios
        axios.get('https://news.ycombinator.com/').then(function(response) {
            //load that into cheerio and save it to $ for shorthand selector
            var $ = cheerio.load(response.data);
            
            //grab headline
            $('td.title').each(function(i, element) {
                //Save empty result object
                var result = {};

                //Add the headline, summary, and URL and save them as properties of the result object
                result.headline = $(this).children('a').text();
                result.link = $(this).children('a').attr('href');
                
                //Create new Article using the result object just built
                db.Article.create(result).then(function(dbArticle) {
                    //View result in console
                    console.log(dbArticle);
                    res.redirect('/');
                }).catch(function(err) {
                    console.log(err);
                });
            });
        });
    });

    //Route to get all Articles from database
    app.get('/articles', function(req, res) {
        db.Article.find({}).then(function(dbArticles) {
            res.json(dbArticles);
        }).catch(function(err) {
            res.json(err);
        });
    });

    //Retrieves the information for the selected article and populates comments
    app.get('/article/:id', function(req, res) {
        db.Article.find({ _id : req.params.id })
        .populate('comments')
        .then(function(chosenArticle) {
            res.json(chosenArticle);
        }).catch(function(err) {
            res.json(err);
        });
    });
    
    //Route to get each comment for a selected article
    app.get('/comment/:id', function(req, res) {
        db.Comment.find({ _id : req.params.id }).then(function(newComment) {
            res.json(newComment);
        }).catch(function(err) {
            res.json(err);
        });
    });

    //Route to save a new comment
    app.post('/comment/:id', function(req, res) {
        db.Comment.create(req.body)
            .then(function(dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComment._id }}, { new: true });
        }).then(function(data) {
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
    });

    //Route to delete a comment
    app.post('/delete/comment/:id', function(req, res) {
        var sendBack = req.body.articleId;
        
        db.Article.update(
            { _id: req.body.articleId },
            { $pull: { comments: req.body.commentId }}
        ).exec();
        
        db.Comment.remove( { _id: req.body.commentId }, function (err) {
            if (err) {console.log("Error");}

        }).then(function() {
            res.json(sendBack);
        }).catch(function(err) {
            res.json(err);
        });
    });

    //Route to delete an article and its related comments
    app.post('/delete/article/:id', function(req, res) {
        db.Article.findByIdAndDelete(
            { _id: req.body.articleId }
        ).exec();
        db.Comment.remove({ 'article' : req.body.articleId})
        .then(function() {
            res.send('Article Deleted');
        }).catch(function(err) {
            res.json(err);
        });
    });

    //Route to delete all articles and comments from database
    app.post('/delete/all', function(req, res) {
        db.Article.remove({}).exec();
        db.Comment.remove({}).then(function(){
            res.send('Database Cleared');
        }).catch(function(err) {
            res.json(err);
        });
    });
};

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
                }).catch(function(err) {
                    console.log(err);
                });
            });
            //Send message to client
            res.send('Scrape Complete');
        });
    });

    //Don't just clear out database and populate with scraped articles whenever a user accesses site
    //If you app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post

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
        db.Article.find({ _id : req.params.id }).populate( 'comment' ).then(function(chosenArticle) {
            res.json(chosenArticle);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // DELETE ME LATER: User comments- users may leave comments and revisit them later- the comments should be saved to the database as well and associated with their articles.  Users should also be able to delete comments left on articles.  All stored comments should be visible to every user
    
    //Route to get each comment
    app.get('/comment/:id', function(req, res) {
        db.Comment.find({ _id : req.params.id }).then(function(newComment) {
            console.log(req.params.id, newComment);
            res.json(newComment);
        }).catch(function(err) {
            res.json(err);
        });
    });

    //Route to save or update a comment
    app.post('/comment/:id', function(req, res) {
        console.log(req.body);
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
    app.post('delete-comment/:id', function(req, res) {
        db.Comment.deleteOne(req.body).then(function(dbComment) {
            res.json(dbComment);
        }).catch(function(err) {
            res.json(err);
        });
    });

};

//Dependencies
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var axios = require('axios');
var cheerio = require('cheerio');

//Require Models
var db = require('./models');

var PORT = 3000;

//Initialize Express
var app = express();

//Configure Middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Makes static folder public
app.use(express.static('public'));

//Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true });

//Routes
app.get('/scrape', function(req, res) {
    //grab the body of the html with axios
    axios.get('ADD URL HERE').then(function(response) {
        //load that into cheerio and save it to $ for shorthand selector
        var $ = cheerio.load(response.data);
        
        //grab headline
        $('HEADLINE ELEMENT').each(function(i, element) {
            //Save empty result object
            var result = {};

            //Add the headline, summary, and URL and save them as properties of the result object
            result.headline = $(this)
                .children('PARENT ELEMENT')
                .text();
            result.summary = $(this)
                .children('PARENT ELEMENT')
                .attr('href');
            
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

//Scrape and display Headline, Summary, URL... (other content is optional- photos, bylines, etc)
//Check that the article is not already in database before storing it- no duplicate stories
//Don't just clear out database and populate with scraped articles whenever a user accesses site
//If you app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post

//User comments- users may leave comments and revisit them later- the comments should be saved to the database as well and associated with their articles.  Users should also be able to delete comments left on articles.  All stored comments should be visible to every user

//Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});
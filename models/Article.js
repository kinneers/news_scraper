var mongoose = require('mongoose');

//Save reference to Schema constructor
var Schema = mongoose.Schema;

//Use Schema constructor to create new UserSchema object
var ArticleSchema = new Schema({
    //Ensures that article titles are present in the form of unique strings
    headline: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    comments: [{
        //An object that stores a Comment id
        type: Schema.Types.ObjectId,
        //links the ObjectId to the Comment model
        ref: 'Comment'
    }]
});

//Creates the model from the schema using mongoose's model method
var Article = mongoose.model('Article', ArticleSchema);

//Exports the Article model
module.exports = Article;

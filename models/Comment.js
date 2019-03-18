var mongoose = require('mongoose');

//Save reference to Schema constructor
var Schema = mongoose.Schema;

//Create new CommentSchema object with schema constructor
var CommentSchema = new Schema({
    //Stores the comment text as a long string
    text: [{
        type: String,
        validate: [
            function(input) {
                return input.length >= 10;
            },
            "Thoughtful comments should be at least 10 characters long."
        ]
    }]
});

//Create the model from the schema using mongoose's model method
var Comment = mongoose.model('Comment', CommentSchema);

//Export the Comment model
module.exports = Comment;

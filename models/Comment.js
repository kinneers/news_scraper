var mongoose = require('mongoose');

//Save reference to Schema constructor
var Schema = mongoose.Schema;

//Create new CommentSchema object with schema constructor
var CommentSchema = new Schema({
    //Stores the comment text as a long string
    comment: {
        type: String,
        required: true,
        validate: [
            function(input) {
                return input.length >= 10;
            },
            'Thoughtful comments should be at least 10 characters long.'
        ]
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
});

//Create the model from the schema using mongoose's model method
var Comment = mongoose.model('Comment', CommentSchema);

//Export the Comment model
module.exports = Comment;

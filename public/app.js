//Calls function to display articles as main content
displayMain();
//When user clicks on a headline on main page (h3 tag with class main), run the chooseArticle function
$(document).on('click tap', 'h3.main', chooseArticle);

//Gets and displays the scraped articles saved in the database
function displayMain() {
    $('#pageTitle').text('Click on a Headline to View Commentary');
    $.getJSON('/articles', function(data) {
        $('mainContent').text('');
        for (i in data) {
            $('#mainContent').append('<h3 class="main" data-id="' + data[i]._id + '">' + data[i].headline + '</h3><p>' + data[i].summary + '</p>');
        };
    });
};

function chooseArticle() {
    //Saves the id from the h3 tag
    var thisId = $(this).attr('data-id');
    //Ajax call for the Article
    $.ajax({
        method: 'GET',
        url: '/article/' + thisId
    }).then(function(data) {
        //Display chosen article and any current comments along with textarea for new comments 
        console.log(data);
        var headline = data[0].headline;
        console.log(headline);
        var summary = data[0].summary;
        console.log(summary);
        var link = data[0].link;
        console.log(link);
        var comments;
        data[0].comments ? comments = data[0].comments : comments = ["There are no comments for this article yet."];
        console.log(comments);
        var dataId = data[0]._id;
        console.log(dataId);
        //Calls function to display commentary associated with chosen article as main content
        displayCommentary(headline, summary, link, comments, dataId);
    });
}

function displayCommentary(headline, summary, link, comments, dataId) {
    $('#pageTitle').text('');

    $('#mainContent').html(
        `<div id="headline">
            <h3>${headline}</h3>
        </div>
        <div id="summary">
            <h4>${summary}</h4>
        </div>
        <div id="link">
            <a href="${link} target="_blank">${link}</a>
        </div>
        <div id="comments">
        </div>
        <div>
        <div id="chosen-article"></div>
        <div class="input-group">
            <textarea class="form-control comment" aria-label="With textarea"></textarea>
            <div class="input-group-append" id="button-addon4">
                <button id="addComment" class="btn btn-outline-secondary" type="submit">Add Comment</button>
            </div>
        </div>`
    );
    for (i in comments) {
        $('#comments').append(
            `<h3>${comments[i]}</h3>`
        );
    };
    //When user clicks button with id addComment:
    $(document).on("click tap", "button#addComment", function() {
        var articleId = dataId;
        var commentText = $('textarea.comment').val();
        
        console.log("ARTICLE ID from button click: " + articleId);
        console.log("TEXT from button click: " + commentText);
        
        //Post comment to database
        $.ajax({
            method: "POST",
            url: "/comment/" + articleId,
            data: {
                text: commentText
            }
        }).then(function(data) {
            console.log(data);
            $('textarea.comment').val('');
        }
        );
    });
};
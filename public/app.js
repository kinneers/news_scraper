//Calls function to display all scraped articles in database
displayMain();

//When user clicks on a headline on main page (h3 tag with class main), run the chooseArticle function
$(document).on('click tap', 'button.chosen', function() {chooseArticle($(this).attr('data-id'));});
//Event listener for the scrape button
$(document).on('click tap', '#scrape', scrapeArticles);
//Event listener for button click to return to main page
$(document).on('click tap', '#mainPage', displayMain);
//Event lister for clearing the database
$(document).on('click tap', '#clearAll', clearDB);
//Event listener for delete article button
$(document).on('click tap', 'button.delete', deleteArticle);

function scrapeArticles() {
    event.preventDefault();
    console.log("Button Clicked!");
    $.ajax({
        method: 'GET',
        url: '/scrape'
    }).then(function(data) {
        console.log('Scraped!' + data);
        displayMain();
    });
}

//Gets and displays the scraped articles saved in the database
function displayMain() {
    $('#mainCard').html('');
    $('#mainCard').html(
        `<h5 id="pageTitle" class="card-header"></h5>
        <div class="card-body">
            <h3 id="mainContent" class="card-title"></h3>
        </div>`);
    
    $.getJSON('/articles', function(data) {
        if (data.length === 0) {
            $('#pageTitle').text('No articles in database. Click the Scrape Articles button to retreive articles.');
        } else {
            $('#pageTitle').text('Click on a Headline to View Commentary');
            $('mainContent').text('');
            for (var i in data) {
                $('#mainContent').append(
                    `<div class="card">
                        <div class="card-header">
                            ${data[i].headline}
                        </div>
                        <div class="card-body">
                            <p class="card-text">${data[i].summary}</p>
                            <button data-id="${data[i]._id}" class="btn btn-primary chosen">View Article</button>
                            <button data-id="${data[i]._id}" class="btn btn-danger delete">Delete Article</button>
                        </div>
                    </div>`
                );
            }
        }
    });
}

function chooseArticle(articleId) {
    $('#mainCard').html('');
    var thisId = articleId ? articleId : $(this).attr('data-id');
    $.ajax({
        method: 'GET',
        url: '/article/' + thisId
    }).then(function(data) {
        //Display chosen article and any current comments along with textarea for new comments 
        var headline = data[0].headline;
        var link = data[0].link;
        var summary = data[0].summary
        var comments = data[0].comments;        
        var dataId = data[0]._id;
        $('#mainCard').html(
            `<h5 id="pageTitle" class="card-header"></h5>
            <div class="card-body">
                <h3 id="mainContent" class="card-title"></h3>
                <p id="summary" class="card-text">This text has the ID of summary (delete this from HTML later)</p>
            </div>`);
        //Calls function to display commentary associated with chosen article as main content
        $('#pageTitle').text('');
        $('#mainContent').text(`${headline}`);
        $('#summary').text(`${summary}`);
        $('#summary').append(
            `<hr><a href="${link}" target="_blank" class="btn btn-primary">Visit: ${link}</a><hr>
            <div id="comments"></div>
            <br>
            <div class="card">
                <div class="card-header">
                    <strong>Add A Comment!</strong>
                </div>
                <div class="input-group">
                    <textarea class="form-control comment" aria-label="With textarea"></textarea>
                    <div class="input-group-append" id="button-addon4">
                        <button id="addComment" data-id="${dataId}" class="btn btn-outline-secondary" type="submit">Add Comment</button>
                    </div>
                </div>
            </div>`
        );
        
        //For each comment Id in the comments array for this particular article append the comment text and delete comment button to the page
        for (var i in comments) {
            $('#comments').append(
                `<div class="card">
                    <div class="card-header"></div>
                    <div class="card-body">
                        <h5 class="card-title">${data[0].comments[i].comment}</h5>
                        <button id="deleteComment" data-id="${dataId}" article-id="${dataId}" comment-id="${data[0].comments[i]._id}" class="btn btn-danger">Delete Comment</button>
                    </div>
                </div>`
            );
        }
    });
}

//When user clicks button with id addComment:
$(document).on("click tap", "button#addComment", function() {
    var articleId = $(this).attr('data-id');
    var commentText = $('textarea.comment').val();
    $('textarea.comment').val('');
    //Post comment to database
    $.ajax({
        method: "POST",
        url: "/comment/" + articleId,
        data: {
            comment: commentText,
            article: articleId
        }
    }).then(function(data) {
        chooseArticle(data._id);
    });
});

//When user clicks button with id deleteComment:
$(document).on('click tap', 'button#deleteComment', function() {
    var articleId = $(this).attr('article-id');
    var commentId = $(this).attr('comment-id');
    
    $.ajax({
        method: 'POST',
        url: '/delete/comment/' + commentId,
        data: {
            commentId: commentId,
            articleId: articleId
        }
    }).then(function(data) {
        console.log(data);
        chooseArticle(data);
    });
});

function deleteArticle() {
    var articleId = $(this).attr('data-id');
    $.ajax({
        method: 'POST',
        url: '/delete/article/' + articleId,
        data: {
            articleId: articleId
        }
    }).then(function(data) {
        console.log(data);
        displayMain();
    });
}

function clearDB() {
    $.ajax({
        method: 'POST',
        url: '/delete/all'
    }).then(function(res) {
        console.log(res);
        displayMain();
    })
}
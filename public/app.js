//Get and display the scraped articles
$.getJSON('/articles', function(data) {
    for (i in data) {
        console.log('An article was found');
    }
});
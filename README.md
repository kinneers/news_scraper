# News Scraper
A web app utilizing Mongoose and Cheerio to scrape news and which also allows users to view and leave comments on the latest news.

### Developed by: Sarah Kinneer
#### March, 2019

## Technologies Used:
Express, Heroku, JavaScript, Mongoose, Cheerio, Bootstrap

## Note:
I chose to use a very basic Bootstrap layout for this app as I was more concerned with functionality that beautification.

### Main Page
![The main page](mainpage.png)

### Article with Comments Page
![The article comments page](commentspage.png)

# Disclaimer:
This app was designed for educational purposes and is for personal use only.  My thanks to the good people at https://sciworthy.com, from where the articles on this site have been scraped.  Please respect their content rights and always scrape responsibly!

## Issues:
I originally attempted to scrape BuzzFeed and was successful... until I discovered that BuzzFeed kept changing their HTML tags.  Since I did not really want to update my code daily and had other projects to work on, I chose a different site.

## Check Out the Live Site:
- [Link to Live Site](https://limitless-sierra-10504.herokuapp.com/)

## To Use:
1. Head to the live site at https://limitless-sierra-10504.herokuapp.com/.
2. If no articles are currently available or you would like to add more recent articles to the list, click the "Scrape New Articles" button in the upper left corner of the screen.
3. If you would like to clear all of the articles from the database, click "Clear All Articles" in the upper left corner of the screen.
4. You can view this main page at any time using the "View Main Page" button in the upper left corner of the screen.
5. Clicking the "View Article" button below an article that interest you will take you to that article's page.  Clicking the "Delete Article" button will remove the related article from the database (along with any comments associated with it).
6. On an article's page, you may click the "View" button that also contains the article's URL to view the original article at its source.
7. To add commentary, simply type a comment in the input box at the bottom of the screen and click "Add Comment".
8. Once a comment has been added, it can be deleted from the database using the "Delete Comment" button.
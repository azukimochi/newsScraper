# News Scraper

This is an online web application that allows users to scrape headlines from the New York Times.  In addition to scraping headlines, users are able to save their desired articles as well attach notes to the articles.  Overall, it was built with CRUD in mind: 

**- CREATE:** Users can scrape headlines, add the headlines to the MongoDB database, and add notes.

**- READ:** Users can filter for their saved articles and any unsaved scraped articles.  Users can also read their saved notes. 

**- UPDATE:** Users can edit their the notes that are saved to articles.

**- DELETE:** Users can delete saved articles.

The technologies used in this application's creation include: JavaScript, jQuery, MongoDB, Node.js, Cheerio.js, NPM, Handlebars, HTML, CSS, and Bootstrap.  Heroku was used to deploy the application as well as to connect it to a remote MongoDB database (via the add-on called mLab or otherwise known as MongoLab). 

The creator of this application is azukimochi and she can be contacted via https://github.com/azukimochi.

## How to Use the Application: 

### Scraping News Articles:

Clicking on the Scrape New Articles button will send a request to scrape the title, summary, and URL of articles from the New York Times.  The data will be rendered as a table for the user.  The user can click on the title to be redirected to the article on the New York Times site, and the user can click the Save button next to the article to save it to their Saved List. 

![](https://azukimochi.github.io/newsScraper/readme_screenshots/screenshot-scrape.png)

### Looking at Your Saved Articles:

The user can look at all their saved articles by clicking on the Saved Articles tab in the navigation bar.  A similar table that lists the title and summary will be rendered with the data of the saved articles.  Buttons for adding notes and deleting the article from the Saved List will also be available.  If a user deletes the article, it will also be deleted from the MongoDB database. 

![](https://azukimochi.github.io/newsScraper/readme_screenshots/screenshot-saved.png)

### Adding and Editing Notes:

When viewing their table of saved articles, there will be a button for adding notes to each article.  A modal will pop up with a clickable text area that can be edited.  In this text area, the user adds and edits their note.  They will need to ensure they click on the Save button in order to update the note that is associated to the article in the MongoDB database. 

![](https://azukimochi.github.io/newsScraper/readme_screenshots/screenshot-note.png)


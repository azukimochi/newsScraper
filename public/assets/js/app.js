$(document).ready(function() {

    // function to do a GET api call for scraping the news 
    function scrapeNews() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (data) {
            setTimeout(location.replace("/scraped-results"), 2000);
        });
    }

    // function to do a PUT api call for saving an article 
    function saveArticle(idObj) {
        $.ajax("/save-article", {
            type: "PUT",
            data: idObj
        }).then(function (data) {
            setTimeout(location.replace("/updated-scraped-results"), 1500);
        });
    };

    // function to do a DELETE api call for deleting an article from the Saved web page 
    function deleteArticle(idObj) {
        $.ajax("/delete-article", {
            type: "DELETE",
            data: idObj
        }).then(function (data) {
            setTimeout(location.reload(), 1500);
        });
    };

    // Clicking the scrape button in the Nav triggers the api call to scrape news 
    $("#scrapeBtn").on("click", function(event) {
        event.preventDefault();
        scrapeNews();
    });

    // Clicking the save button next to the scraped article triggers the api call to save the article 
    $("#saveBtns").on("click", function (event) {
        event.preventDefault();
        // console.log(`This is the ID stored in the button: ${$(this).val()}`);
        var idObj = {
            id: $(this).val()
        }
        saveArticle(idObj);
    });

    // Clicking the delete button next to the saved article deletes it from the saved web page and from the database 
    $("#delBtns").on("click", function (event) {
        event.preventDefault();
        // console.log(`This is the ID stored in the button: ${$(this).val()}`);
        var idObj = {
            id: $(this).val()
        }
        deleteArticle(idObj);
    });

    // Clicking on the notes button next to the saved article opens a modal to allow the user to type in a note 
    $("#noteBtns").on("click", function (event) {
        event.preventDefault();
        $(".existingNotesContainer").empty();
        $("#saveMsg").hide();
        var articleID = $(this).val();
        $("#noteModal").attr("data-id", articleID);
        // console.log("the associated ID is: " + $("#noteModal").attr("data-id"));

        $.ajax({
            method: "GET",
            url: "/articles/" + articleID
        }).then(function (data) {
            //   console.log(data);
            $(".existingNotesContainer").append("<div id='existingNoteInput' name='body' contenteditable='true'></div>");
            $(".existingNotesContainer").append("<button data-id='" + data._id + "' class='btn btn-primary' id='saveNoteBtns'>Save</button>");

            if (data.note) {
                $("#existingNoteInput").append(data.note.body);
            }
        })


    });

    // Clicking on the save button in the notes modal allows the user to save the  note associated to the article 
    $(document).on("click", "#saveNoteBtns", function (event) {
        event.preventDefault();
        var articleID = $(this).attr("data-id");
        // console.log(articleID);
        // console.log("input: " + $("#existingNoteInput").text());
        $.ajax({
            method: "POST",
            url: "/articles/" + articleID,
            data: {
                id: articleID,
                body: $("#existingNoteInput").text()
            }
        })
            .then(function (data) {
                // console.log(data);
                $("#saveMsg").show();
            });

    });

});
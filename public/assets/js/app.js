$(document).ready(() => {
    
    function scrapeNews() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (data) {
            setTimeout(location.replace("/scraped-results"), 1500);
        });
    }

    function saveArticle(idObj) {
        $.ajax("/save-article", {
            type: "PUT",
            data: idObj
        }).then(function(data) {
            setTimeout(location.replace("/updated-scraped-results"), 1500);
        });
    };

    function deleteArticle(idObj) {
        $.ajax("/delete-article", {
            type: "DELETE",
            data: idObj
        }).then(function(data) {
            setTimeout(location.reload(), 1500);
        });
    };

    $("#scrapeBtn").on("click", event => {
        event.preventDefault();
        scrapeNews();
        // setTimeout(goToScrapedResults, 1500);
        console.log(`Hi, the scrape button is working!`);
    });

    console.log(`ocument is ready!`);

    $(".saveBtns").on("click", function(event) {
        event.preventDefault();
        console.log(`Hi the save button is being clicked`);
        console.log(`This is the ID stored in the button: ${$(this).val()}`);
        var idObj = {
            id: $(this).val()
        }
        saveArticle(idObj);
    });

    $(".delBtns").on("click", function(event) {
        event.preventDefault();
        console.log(`Hi the delete button is being clicked`);
        console.log(`This is the ID stored in the button: ${$(this).val()}`);
        var idObj = {
            id: $(this).val()
        }
        deleteArticle(idObj);
    });

    $(".noteBtns").on("click", function(event) {
        event.preventDefault();
        $(".existingNotesContainer").empty();
        $("#saveMsg").hide();
        console.log("the note button is working");
        let articleID = $(this).val();
        $("#noteModal").attr("data-id", articleID);
        console.log("the associated ID is: " + $("#noteModal").attr("data-id"));

        $.ajax({
            method: "GET",
            url: "/articles/" + articleID
          }).then(function(data) {
              console.log(data);
              $(".existingNotesContainer").append("<div id='existingNoteInput' name='body' contenteditable='true'></div>");
              $(".existingNotesContainer").append("<button data-id='"+ data._id + "' class='saveNoteBtns'>Save</button>");
              
              if (data.note) {
                  $("#existingNoteInput").append(data.note.body);
                }
                // $("#noteModal").modal("toggle");
            })


    });

    $(document).on("click", ".saveNoteBtns", function (event) {
        event.preventDefault();
        console.log("Hi, the save button is working!");
        let articleID = $(this).attr("data-id");
        console.log(articleID);
        console.log("input: " + $("#existingNoteInput").text());
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + articleID,
            data: {
                id: articleID,
                // Value taken from note textarea
                body: $("#existingNoteInput").text()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#saveMsg").show();
                // $(".existingNotesContainer").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        // $("#titleinput").val("");
        // $("#bodyinput").val("");
    });

});
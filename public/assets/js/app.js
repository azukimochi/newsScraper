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



});
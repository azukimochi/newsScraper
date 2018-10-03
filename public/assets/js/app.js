$(document).ready(() => {

    $("#scrapeBtn").on("click", event => {
        event.preventDefault();
        scrapeNews();
        setTimeout(goToScrapedResults, 1500);
        console.log(`Hi, the scrape button is working!`);
    });

    console.log(`ocument is ready!`);

    function scrapeNews() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (data) {
        });
    }

    function goToScrapedResults() {
        location.replace("/scraped-results");
    }

});
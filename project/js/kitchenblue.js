// jshint esversion:6

// JavaScript file for the web page "Kitchen Blue"
// Created by Harrison Kong
// Copyright (C) Coursera 2020

// This function is called automatically after the web page is done loading

$(document).ready(function() {
    // add an event listener (performSearch) to the form
    $("#query-form").submit(function(event) { performSearch(event); });
});

// These website no longer work but are still returned by the recipe puppy

var defunctDomains = [
    "kraftfoods.com",
    "cookeatshare.com",
    "find.myrecipes.com"
];

// This function checks to see if a URL contains the domain of any of the
// defunctDomains above

function isADefunctSite(sampleSite) {

    var found = false;

    defunctDomains.forEach(
        function(item, index) {
            if (sampleSite.includes(item)) { found = true; }
        }
    );

    return found;

}

// This function turns the results that is returned into HTML elements
// to display on the web page

function formatSearchResults(jsonResults) {

    var jsonObject = JSON.parse(jsonResults);
    var siteCount = 0;

    if (jsonObject.results.length == 0) { // Task 5: Part 1
        setNotFoundMessages(); // Task 5: Part 1
    } // Task 5: Part 1
    else { // Task 5: Part 1

        $("#search-results-heading").text("Search Results");
        var formatedText = "";

        jsonObject.results.forEach(
            function(item, index) {

                // if (isADefunctSite(item.href)) { return; } // Task 5: Part 2
                // siteCount++; // Task 5: Part 2

                var thumbnail = item.thumbnail;
                // if (thumbnail == "") { thumbnail = ""; }  // Task 5, Part 3, display images/generic_dish.jpg if thumbnail is empty

                const href = item.href;

                formatedText += "<div class='dish-image-div'><a " + " href='" + href + "' target='_blank'><img class='dish-image' width='80' src='" + thumbnail + "' alt='recipe picture, link to recipe page'></a></div>";
                formatedText += "<div " + "class='dish-title-div'><a href='" + href + "' target='_blank'>" + item.title + "</a></div>";
                formatedText += "<div class='dish-ingredients-div'>Main ingredients: " + item.ingredients + "</div>";
            }
        );

        //if (siteCount > 0) { // Task 5: Part 2
        $("#results").html(formatedText);
        // } // Task 5: Part 2
        // else { // Task 5: Part 2
        // setNotFoundMessages(); // Task 5: Part 2
        // } // Task 5: Part 2
    } // Task 5: Part 1

}

// This functions handles sending off the search request as well as
// error and success handling when the request calls back

function performSearch(event) {

    // Variable to hold request
    var request;

    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // Abort any pending request
    if (request) {
        request.abort();
    }
    // setup some local variables
    var $form = $(this);

    // disable the inputs and buttons for the duration of the request.
    setFormDisabledProps(true);

    $("#search-results-heading").text("Searching ...");
    $("#results").text("");

    // Send the request

    request = $.ajax({
        url: "https://cors-anywhere.herokuapp.com/" + "http://www.recipepuppy.com/api/",
        type: "GET",
        data: { i: $("#ingredients").val(), q: $("contains").val() }
    });

    // Callback handler for success

    request.done(function(response, textStatus, jqXHR) {
        formatSearchResults(response); // Task 4 - uncomment
        //$("#results").html("<p>" + response + "</p>"); // Task 4 - comment out
    });

    // Callback handler for failure

    request.fail(function(jqXHR, textStatus, errorThrown) {
        $("#search-results-heading").text("An error occurred. Please try again.");
        $("#results").text("");
    });

    // Callback handler that will be called in any case

    request.always(function() {
        // Reenable the inputs
        setFormDisabledProps(false);
    });

}

// This function clears the search results and the heading "Search Results"

function resetResults() {
    $("#search-results-heading").text("");
    $("#results").text("");
}

// This function checks the user input fields for any unacceptable characters
// and removes them if found

function sanitizeInputs() {
    var str = $("#ingredients").val();
    str = str.replace(/[^a-zA-Z 0-9,]/gim, "");
    str = str.trim();
    $("#ingredients").val(str);

    // Task 5, do the same for the field "contains"
    var str = $("#contains").val();
    str = str.replace(/[^a-zA-Z 0-9]/gim, "");
    str = str.trim();
    $("#contains").val(str);
}

// This function disables the text fields and the two buttons

function setFormDisabledProps(statusToSet) {
    document.getElementById("ingredients").disabled = statusToSet;
    document.getElementById("contains").disabled = statusToSet;
    document.getElementById("resetButton").disabled = statusToSet;
    document.getElementById("searchButton").disabled = statusToSet;
}

// This function sets the result heading to "no recipes found" and clear the
// existing search results, if there are any

function setNotFoundMessages() {
    $("#search-results-heading").text("No recipes found, please change search criteria.");
    $("#results").text("");
}
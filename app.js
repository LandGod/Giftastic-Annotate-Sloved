// Don't start until the document has fully loaded
$(document).ready(function() {

  // List of animal name to be used as topic buttons
  var animals = [
    "dog", "cat", "rabbit", "hamster", "skunk", "goldfish",
    "bird", "ferret", "turtle", "sugar glider", "chinchilla",
    "hedgehog", "hermit crab", "gerbil", "pygmy goat", "chicken",
    "capybara", "teacup pig", "serval", "salamander", "frog"
  ];

  // A function that takes an array, a new topic to add to that array, and an html element
  // The function then erases the contents of the html element
  // Then the function constructs a button, gives it the supplied class, gives it a 'data-type' attribute and text of the first array element
  // After appending the new button element to the supplied 'areaToAddTo' element, the process is repeated for each element of the array
  function populateButtons(arrayToUse, classToAdd, areaToAddTo) {
    $(areaToAddTo).empty();

    for (var i = 0; i < arrayToUse.length; i++) {
      var a = $("<button>");
      a.addClass(classToAdd);
      a.attr("data-type", arrayToUse[i]);
      a.text(arrayToUse[i]);
      $(areaToAddTo).append(a);
    }

  }

  // Creates a click handler (event listener) that triggers an anonymouse function whenever any element with the class 'animal-button' is clicked
  $(document).on("click", ".animal-button", function() {

    $("#animals").empty(); // Removes contents of an element with the id 'animals'
    $(".animal-button").removeClass("active"); // Removes 'active' from the string of classes in elements with the 'animal-button' class
    $(this).addClass("active"); // Adds the 'active' class to the element that triggered the click event

    // Takes the value of the 'data-type' attribute for the element which was clicked and stores it in a variable called 'type'
    var type = $(this).attr("data-type");
    
    // Constructs a url which can be used to make a GET request to the giphy API, using the keyword stored in 'type'
    // and limits the returned results to 10
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + type + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

    // Using jQuery's ajax method and the above url, makes a GET request to the giphy api
    $.ajax({
      url: queryURL,
      method: "GET"
    })

      // Callback function which is triggered when the above API call recieves a response.
      // Creates a promise object which is 'fulfilled' when a response object is recieved from giphy
      // This triggers the anonymous function specified and passes in a response object as an argument.
      .then(function(response) {

        //Creates a variable called 'results' and sets it's value equal to the 'data' array contained within the response object
        var results = response.data;

        // Iterates over the array contained in 'results', which should contain 10 objects
        for (var i = 0; i < results.length; i++) {

          // Create a new div with class 'animal-item'
          var animalDiv = $("<div class=\"animal-item\">"); // Escape quotes to avoid syntax errors
          
          // Grab the gif's rating from the object
          var rating = results[i].rating;

          // create a new p tag and set it's text to the rating we just grabbed, with the word 'rating:' in front
          var p = $("<p>").text("Rating: " + rating);

          // Grab urls for the animated and still versions of the gif from the object
          var animated = results[i].images.fixed_height.url;
          var still = results[i].images.fixed_height_still.url;
          
          // Create a new image tag and set its src attribute to the url for the still image
          // Then give it custom atributes to store both the still and animated image urls for later use
          // Also add a custom attribute for denoting whether the sill or animated url is currently being used.
          // Add class animal-image
          var animalImage = $("<img>");
          animalImage.attr("src", still);
          animalImage.attr("data-still", still);
          animalImage.attr("data-animate", animated);
          animalImage.attr("data-state", "still");
          animalImage.addClass("animal-image");
          
          // append p tag and image tag to the html element in 'animalDiv'
          animalDiv.append(p);
          animalDiv.append(animalImage);

          // Append the now completed div to the elment with id 'animals'
          $("#animals").append(animalDiv);

          // repeat for all other objects in list
        }
      });
  });

  // Click handler for all html elements with class 'animal-image'
  $(document).on("click", ".animal-image", function() {

    // Get current state from 'data-state' attribute
    var state = $(this).attr("data-state");

    // Depending on current state, swap src attribute to the other url and data-state attribute to the oppposite value
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    }
    else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  });

  // Click handler for all html elements with id 'add-animal'
  $("#add-animal").on("click", function(event) {
    // Stop page from reloading when form submit button is clicked
    event.preventDefault();
    // assign the value of the text currently in the first html input tag of the document to a variable called 'new-animal'
    var newAnimal = $("input").eq(0).val();

    // If the supplied data is long enough to possibly be a valid animal name, then add it to the list
    if (newAnimal.length > 2) {
      animals.push(newAnimal);
    }

    // Call populate buttons function, with the list animals, button class that the click handler is listening for, and id of the place we're displaying the buttons in the html
    // This will erase all currently displayed buttons and then re-generate them using the list, which we have just added to.
    populateButtons(animals, "animal-button", "#animal-buttons");

  });

  // Do the above when the page is opened for the first time.
  populateButtons(animals, "animal-button", "#animal-buttons");
});

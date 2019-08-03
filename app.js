$(document).on("click", function(event) {

    // Here we grab the text from the input box
    // var pokemon = $("#pokeMon").val();

    // console.log('Pokemon: ', pokemon)
    // Here we construct our URL
    var queryURL = "https://pokeapi.co/api/v2/pokemon/"+ Math.floor(Math.random()*807)+"/"


    // Write code between the dashes below to hit the queryURL with $ajax, then 
    // YOUR CODE GOES IN THESE DASHES. DO NOT MANUALLY EDIT THE HTML ABOVE
    // Write code between the dashes below to hit the queryURL with $ajax, then take the response data
    // and display it in the div with an id of movie-view
    $.ajax({
      url: queryURL,
      method: 'GET'
    })
    // .then() => is a method from the Promise library that promises to execute a callback function
    // callback => is going to capture the data that comes back from our AJAX call
    // a callback function is a nested function that is triggered via a parent function
    .then(function(response){
      console.log(response.name)
      console.log(response.stats)
      console.log(response.height)
      console.log(response.weight)
  
    })
});

    // =================================================================

    // $.ajax({
    //     //First, feed the ajax call the queryurl that we tested already
    //     url: queryURL,
    //     //Initialize a get method in order to retrieve info
    //     method: "GET"
    //     //.then() => method from the promise library that promises to exectue the following callback function
    //       //callback function: nested function that is called by a parent function
    //   }).then(function(response) {
        
    //   //take the response data and display it in the div with an id of movie-view
    //   $("#movie-view").append([JSON.stringify(response.Title)]);
    //   $("#movie-view").append([JSON.stringify(response.Year)]);
    //   $("#movie-view").append([JSON.stringify(response.Actors)]);
    //   $("#movie-view").append([JSON.stringify(response.Plot)]);
    //   $("#movie-view").append([JSON.stringify("<img src="+response.Poster+"</img>")]);

    //   });




//this variable will hold the output of the faceAPI call 
//this will be a list of key/value pairs related to emotions and % of emotion detected 
//delcared here so other functions can access
var faceEmotions = {};

//This function is essentially what runs when the user hits their submit button to upload their image

//Initialize function when user clicks the submit button
$("#submitButton").on("click", function () {
    //Defining count variable to iterate through ajax calls while avoiding use of for loop (due to asynchronous-ness)
    var count = 1;

    //Create empty array to store ajax call results, end result should be an array of all pokemon called + details
    var pokemonAvailable = []

    //Function w/ ajax call to pull data on however many pokemon
    function fetchPokemon() {

        // Here we construct our URL, and pick our pokemon by its 'id number' (pokedex number). In this case, we limit our results to the first 150 pokemon (OG) -- 50 for testing purposes
        var queryURL1 = "https://pokeapi.co/api/v2/pokemon/" + count + "/"

        var queryURL2 = "https://pokeapi.co/api/v2/pokemon-species/" + count + "/"

        // Write code to hit the queryURL with $ajax, 'GET' our returned results, and then take the response data
        // and console log the specific elements we are returning
        $.ajax({
            url: queryURL1,
            method: 'GET'
        })
            // .then() => is a method from the Promise library that promises to execute a callback function. The callback => is going to capture the data that comes back from our AJAX call

            //TEST - RUN SECOND AJAX FUNCTION ON SECOND API
            .then(function (response1) {
                //For each ajax call run, push the resulting details to our array outside of ajax
                pokemonAvailable.push(response1)

                //Testing console logs + information we want to use in face comparison
                // console.log(response1.name)
                // console.log(response1.stats)
                // console.log(response1.height)
                // console.log(response1.weight)
                // console.log(response1.sprites.front_default)
                console.log(pokemonAvailable);

                if (count < 50) {
                    count = count + 1;
                    console.log('BIG COUNT TOTAL:', count);
                    fetchPokemon();
                }
            })

        var randomPoke = Math.floor(Math.random() * 50)
        var randomPokeName = pokemonAvailable[randomPoke].name
        var randomPokeImg = pokemonAvailable[randomPoke].sprites.front_default
        console.log("Random Poke Name", randomPokeName)
        console.log("Random Poke Image", randomPokeImg)
        // return(randomPokeName, randomPokeImg)

        $("#pokeImage").html("<img src='" + randomPokeImg + "'>")


    }

    fetchPokemon();
});


/*=============================================
=User image upload (POST) and faceAPI call (POST)=
=============================================*/
$(document).ready(function () {
    //Cloudinary is the image hosting service
    //variable that holds the link provided by the site and uses the 'upload' method
    //cloudinary upload API url 
    var CLOUNDINARY_URL = 'https://api.cloudinary.com/v1_1/da35qrt1i/upload';
    //unique id link to our cloudinary account 
    var CLOUNDINARY_UPLOAD_PRESET = 'zqc6zawb';
    //Executes after the user has chosen a file to open 
    //detects "change"




    $("#user-image").change(function (e) {

        //variable that stores the file the user uploaded
        var uploadFile = e.target.files[0];
        //formData provides a way to easily construct a set of key/value pairs representing form fields and their values
        var formData = new FormData();
        //appends a new key/value pair representing the file to upload to the cloud
        formData.append('file', uploadFile);
        //appends a new key/value pair repretenting the unique id link to our cloudinary account 
        formData.append('upload_preset', CLOUNDINARY_UPLOAD_PRESET);
        // Promise based HTTP client for the browser and node.js
        //similar to ajax
        //asynchronous POST which reurns a promise
        //this method is used to upload the user image to the cloud and return the link to the image
        axios({
            url: CLOUNDINARY_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'applications/x-www-form-urlencoded'
            },
            data: formData
        })
            //a method from the Promise library that promises to execute a callback function. The callback => is going to capture the data that comes back from our AJAX call
            .then(function (res) {

                //variable that stores the url leading to the user image that was uploaded to the cloud 
                uploadedImgLink = res.data.url;
                //this variable holds the Face API url
                faceURL = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=emotion&recognitionModel=recognition_01&detectionModel=detection_01"

                //this method is used to POST to the the Face API 
                //this will use the FaceAPI to analyze the user image after it has been uploaded to the cloud 
                axios({
                    url: faceURL,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': '42bfc0fb6f98403fa3df091c5f1a4b15'
                    },
                    data: {
                        'url': uploadedImgLink
                    }
                })
                    //will caputue the promise returned by the POST
                    .then(function (res2) {
                        //variable that stores the faceAttributes object spit out from the FaceAPI POST call
                        //example: "faceAttributes": { "emotion": { "anger": 0.0, "contempt": 0.0, "disgust": 0.0, "fear": 0.015, "happiness": 0.219, "neutral": 0.0, "sadness": 0.0, "surprise": 0.766 } }
                        faceEmotions = res2.data[0].faceAttributes.emotion;
                    })
                    //returns a Promise and deals with rejected cases 
                    .catch(function (err2) {
                        console.error(err2);
                    })
            })
            .catch(function (err) {
                console.error(err);
            });

    });
});
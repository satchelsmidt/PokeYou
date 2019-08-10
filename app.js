// ====================== INTRO SCREEN ========================

// global variable to have instructions hide on page load

$(document).ready(function () {
    $("#instructions").hide();
})

// onclick function for when the user clicks the image

$("#akey").on("click", function () {

    // hide the intro text div
    $("#introtext").hide();


    // display instructions div
    $("#instructions").show();

})

// onclick function for when the user clicks the down arrow

$("#downkey").click(function () {
    $("html, body").animate({ scrollTop: $(document).height() }, 1600);
    return false;
});

// ====================== END OF INTRO SCREEN ========================

// ========= Method to call on the AOS library for card animation=======================

AOS.init({
    duration: 3000,
    delay: 1000,
});

// ========= End of Method to call on the AOS library for card animation=======================

//this variable will hold the output of the faceAPI call 
//this will be a list of key/value pairs related to emotions and % of emotion detected 
var highestEmotion = "";
//object containing the arrays of pokemon and associated emoitons
var pokemonEmotions = {
    anger: [3, 14, 15, 18, 20, 24, 28, 29, 33, 34, 55, 56, 57, 62, 64, 65, 76, 83, 85, 100, 105, 106, 107, 115, 117, 123, 125, 127, 130, 145],
    contempt: [2, 5, 6, 7, 8, 9, 17, 38, 45, 53, 58, 59, 67, 73, 91, 96, 97, 99, 102, 126, 128, 131, 133, 134, 135, 146, 150],
    disgust: [12, 16, 68, 74, 78, 88, 89, 95, 108, 109, 110],
    happiness: [1, 4, 25, 26, 35, 36, 39, 40, 43, 61, 66, 87, 103, 113, 122, 149],
    neutral: [10, 13, 46, 49, 50, 51, 71, 77, 79, 81, 82, 84, 98, 111, 116, 120, 121, 129, 132, 137, 138, 140, 141, 143, 147, 148],
    sadness: [11, 30, 44, 60, 63, 104],
    surprise: [21, 23, 31, 37, 46, 54, 69, 70, 80, 86, 90, 112, 118, 136, 144]
}
//want to display the top 5 pokemon that poeople are getting
//this object will hold the count for each pokemon that get generated 
//try creating an object equal to the pokemon and then giving that k/v equal to the count and the link to the sprite 
let pokeTotals = {};
//add object {name:v,link:v}
let pokeTotalsArray = [];


//Define pokemon features that we want to return after call (globally)
var pokemonName;
var pokemonImage;
var pokemonType;
var pokemonAbility;
var pokemonMoveOne;
var pokemonMoveTwo;


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

                        //Empty placeholder image div
                        $("#userImage").empty();
                        //Put user's uploaded image into div
                        $("#userImage").attr("src", uploadedImgLink)
                        //variable that stores the faceAttributes object spit out from the FaceAPI POST call
                        //example: "faceAttributes": { "emotion": { "anger": 0.0, "contempt": 0.0, "disgust": 0.0, "fear": 0.015, "happiness": 0.219, "neutral": 0.0, "sadness": 0.0, "surprise": 0.766 } }
                        let faceEmotions = res2.data[0].faceAttributes.emotion;
                        //this will turn the faceEmoitons object in to an array of the key value pairs (array = [key,value])
                        let emotionValues = Object.entries(faceEmotions);
                        //temp store the value of the highest emotion value (0 to 1) for the loop below
                        var count = 0;
                        //iterate through each k,v pair and find the highest value; assign the string descriptor for the highest value to a variable 
                        for (let i = 0; i < emotionValues.length - 1; i++) {
                            //if the value of the emotion is greater than the next highest
                            if (emotionValues[i][1] > count) {
                                //assign that value as the highest 
                                count = emotionValues[i][1];
                                //assign the string descriptor for the highest value to a variable
                                highestEmotion = emotionValues[i][0];
                            }
                        }
                        console.log(highestEmotion);


                        //this variable will hold the array related to the pokemon with the assocted with the highest valued emotion
                        var choosenArray = pokemonEmotions[highestEmotion];


                        //generate a random number based on the length of the pokeArray related to the highest valued emotion
                        var randomNumber = Math.floor(Math.random() * choosenArray.length);


                        //should be a random number from the array 
                        var choosenPokemon = choosenArray[randomNumber];


                        var queryURL1 = "https://pokeapi.co/api/v2/pokemon/" + choosenPokemon + "/"
                        //async call to the pokemonAPI
                        //should return just one pokemon 
                        //store relevaent imformation with future variables 
                        $.ajax({
                            url: queryURL1,
                            method: 'GET'
                        }).then(function (res3) {
                            //Return pokemon name

                            let isThere = false;
                            //iterate through the pokeTotals array 
                            //check to see if the pokemon is in the array and add to the count if so and cset isThere to true so that a duplicate is not added after the loop ends 
                            for (let i = 0; i < pokeTotalsArray.length - 1; i++) {
                                if (isThere === false) {
                                    if (pokeTotalsArray[i].name === res3.name) {
                                        isThere = true;
                                        pokeTotalsArray[i].count = pokeTotalsArray[i].count+1;
                                    }
                                }
                            }
                            //creates a new pokemon object to keep count and grab the link to the sprite 
                            if (isThere === false) {
                                let countedPokemon = {
                                    name: res3.name,
                                    link: res3.sprites.front_default,
                                    count: 1
                                }
                                pokeTotalsArray.push(countedPokemon);
                            }

                            console.log(pokeTotalsArray);




                            //set the meta tag which represents the image when shared to facebook
                            $("#facebook-img").attr("content", res3.sprites.front_default);
                            $("#twitter-link").attr("data-url", res3.sprites.front_default);

                        }).catch(function (err3) {
                          
                            console.error(err2);
                        }).catch(function (err3) { //Error catching ////////////////////////////////////

                            console.error(err3);
                        })
                    })
                    //returns a Promise and deals with rejected cases 
                    .catch(function (err2) {
                        console.error(err2);
                    })
            })
            .catch(function (err) {
                console.error(err);
            }); // End of error catching ////////////////////////////////////////////////

    });
});

$("#submitButton").on("click", function () {

    $("#pokeName").text(pokemonName)
    $("#pokeImageReal").attr("src", pokemonImage)
    $("#pokemonType").text(pokemonType)
    $("#pokemonAbility").text(pokemonAbility)
    $("#pokemonMoveTwo").text(pokemonMoveTwo)
    $("#pokemonMoveOne").text(pokemonMoveOne)

});

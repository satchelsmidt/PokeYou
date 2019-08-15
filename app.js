// ====================== INTRO SCREEN ========================

// global variable to have instructions hide on page load

$(document).ready(function () {
    $("#instructions").hide();
    $("#modal").hide();
})

// onclick function for when the user clicks the A button

$("#akey").on("click", function () {

    // hide the intro text div
    $("#introtext").hide();


    // display instructions div
    $("#instructions").show();

})

// onclick function for when the user clicks the B button

$("#bkey").on("click", function () {
    console.log("success b click")
    if (!$(".pokeball").hasClass("pokeballanimate") && !$(".pokeball__button").hasClass("pokeball__buttonanimate")) {
        $(".pokeball").addClass("pokeballanimate");
        $(".pokeball__button").addClass("pokeball__buttonanimate");
    } else {
        $(".pokeball").removeClass("pokeballanimate");
        $(".pokeball__button").removeClass("pokeball__buttonanimate");
    }

})

// onclick function for when the user clicks the down arrow

$("#downkey").click(function () {
    $("html, body").animate({ scrollTop: $(document).height() }, 1600);
    return false;
});

// ====================== END OF INTRO SCREEN ========================

// ========= Method to call on the AOS library for card animation=======================

AOS.init({
    duration: 2000,
    delay: 1000,
});

// ========= End of Method to call on the AOS library for card animation=======================

//this variable will hold the output of the faceAPI call 
//this will be a list of key/value pairs related to emotions and % of emotion detected 
var highestEmotion = "";

//object containing the arrays of pokemon and associated emotions
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

//Define user returned pokemon and random returned pokemon
var userPokemon;
var randomPokemon;

//Pokemon List Functionality
const pokeList = $('#top-five');

//create list elements for the top 5 pokemon list 
function renderPokemon(doc) {
    let li = $('<li>');
    let pokeImg = $('<img>').attr('src', doc.data().link);
    let name = $('<span>').text(doc.data().name);
    let count = $('<span>').text(doc.data().count);

    li.append(pokeImg);
    li.append(name);
    li.append(count);

    pokeList.append(li);
}

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
                faceURL = "https://deron.cognitiveservices.azure.com/face/v1.0/detect?returnFaceAttributes=emotion&recognitionModel=recognition_01&detectionModel=detection_01"
                //this method is used to POST to the the Face API 
                //this will use the FaceAPI to analyze the user image after it has been uploaded to the cloud 
                axios({
                    url: faceURL,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': '77c957a366ba45039501c70fa1221494'
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
                        var chosenArray = pokemonEmotions[highestEmotion];

                        //generate a random number based on the length of the pokeArray related to the highest valued emotion
                        var randomNumber = Math.floor(Math.random() * chosenArray.length);

                        //should be a random number from the array 
                        var userChosenPokemon = chosenArray[randomNumber];

                        var queryURL1 = "https://pokeapi.co/api/v2/pokemon/" + userChosenPokemon + "/"
                        //async call to the pokemonAPI, should return just one pokemon 
                        //store relevant imformation with future variables 
                        $.ajax({
                            url: queryURL1,
                            method: 'GET'
                        }).then(function (res3) {
                            ///////////////Pokemon Data Returned (Object format)/////////////////////
                            userPokemon = {
                                pokemonName: res3.name,
                                pokemonImage: res3.sprites.front_default,
                                pokemonAbility: res3.abilities[Math.floor(Math.random() * res3.abilities.length)].ability.name,
                                pokemonType: res3.types[Math.floor(Math.random() * res3.types.length)].type.name,
                                pokemonMoveOne: res3.moves[Math.floor(Math.random() * res3.moves.length)].move.name,
                                pokemonMoveTwo: res3.moves[Math.floor(Math.random() * res3.moves.length)].move.name,
                                pokemonHealth: 100 + (Math.floor(Math.random() * 100)),
                                pokemonMoveOneDmg: 10 + (Math.floor(Math.random() * 15)),
                                pokemonMoveTwoDmg: 50 + (Math.floor(Math.random() * 50)),
                                damageReceived: 10 + (Math.floor(Math.random() * 90))
                            }

                            console.log("USER POKE: ", userPokemon)

                            ///////Random Pokemon data is defined (pick random num from 1 - 150)
                            var randomPokemonNum = Math.floor(Math.random() * 150)
                            var randomUrl = "https://pokeapi.co/api/v2/pokemon/" + randomPokemonNum + "/"

                            $.ajax({
                                url: randomUrl,
                                method: 'GET'
                            }).then(function (randResponse) {

                                /////////////////////////Random Pokemon Data Returned///////////////////////////
                                randomPokemon = {
                                    pokemonName: randResponse.name,
                                    pokemonImage: randResponse.sprites.front_default,
                                    pokemonAbility: randResponse.abilities[Math.floor(Math.random() * randResponse.abilities.length)].ability.name,
                                    pokemonType: randResponse.types[Math.floor(Math.random() * randResponse.types.length)].type.name,
                                    pokemonMoveOne: randResponse.moves[Math.floor(Math.random() * randResponse.moves.length)].move.name,
                                    pokemonMoveTwo: randResponse.moves[Math.floor(Math.random() * randResponse.moves.length)].move.name,
                                    pokemonHealth: 100 + (Math.floor(Math.random() * 100))
                                }

                                console.log("THIS IS A RANDOM POKEMON: ", randomPokemon)

                            });

                            //FIREBASE
                            ///add pokemon to firebase
                            db.collection('pokeCount').doc(userPokemon.pokemonName).get().then((snapshot) => {
                                //if pokemon is not in the database add it
                                if (snapshot.data() === undefined) {
                                    db.collection('pokeCount').doc(userPokemon.pokemonName).set({
                                        name: userPokemon.pokemonName,
                                        link: userPokemon.pokemonImage,
                                        count: 1,
                                    });
                                }
                                //if pokemon is in the database, increase the count 
                                else {
                                    db.collection('pokeCount').doc(userPokemon.pokemonName).update({
                                        count: snapshot.data().count + 1,
                                    });
                                }
                            })

                            //set the meta tag which represents the image when shared to facebook
                            $("#facebook-img").attr("content", userPokemon.pokemonImage);
                            $("#twitter-link").attr("data-url", userPokemon.pokemonImage);

                        }).catch(function (err3) { ////BEGIN ERROR CATCHING /////////////////////////////////
                            console.error(err3);
                        })
                    })

                    //returns a Promise and deals with rejected cases 
                    .catch(function (err2) {
                        console.error(err2);
                        //display modal element
                        $("#modal").show();

                        //close modal when X is clicked
                        $(".close").on("click", function () {
                            $("#modal").hide();

                        });
                    })
            })
            .catch(function (err) {
                console.error(err);
            });
        // End of error catching ////////////////////////////////////////////////
    });
});

$("#submitButton").on("click", function () {
    //Hide submit button (no more pressing)
    $("#submitButton").attr("hidden", true)

    //Generate User Pokemon Card
    $("#pokeName").text(userPokemon.pokemonName)
    $("#pokeImageReal").attr("src", userPokemon.pokemonImage)
    $("#pokemonType").text(userPokemon.pokemonType)
    $("#pokemonAbility").text(userPokemon.pokemonAbility)
    $("#pokemonMoveTwo").text(userPokemon.pokemonMoveTwo)
    $("#pokemonMoveOne").text(userPokemon.pokemonMoveOne)

    //Make 'Battle Button' appear as an option
    $("#battleButton").attr("hidden", false)

});

//Define music vars
let battleMusic = document.getElementById("battleMusic")
let victoryMusic = document.getElementById("victoryMusic")
let failureMusic = document.getElementById("failureMusic")


//Function that runs when battle button is clicked (BATTLE ZONE)
$("#battleButton").on("click", function () {

    //Hide battle button so people can't keep clicking it
    $("#battleButton").attr("hidden", true)

    //Play battle music
    battleMusic.play()

    /////////////////// APPEND HELLA THINGS TO CREATE USER CARD //////////////////////////////
    $("#battleRow").attr("hidden", false)

    var userBattleTable = $("<table class='table'>")
    userBattleTable.attr("id", "userBattleTable")

    var userBattleRowOne = $("<tr>")
    var userBattleMoveTitleOne = $("<th>Move Two<th>")
    var userBattleMoveTitleTwo = $("<th>Move One<th>")

    userBattleRowOne.append(userBattleMoveTitleOne)
    userBattleRowOne.append(userBattleMoveTitleTwo)

    var userBattleRowTwo = $("<tr>")
    var userBattleMoveOne = $("<td>" + userPokemon.pokemonMoveOne + "<td>")
    var userBattleMoveTwo = $("<td>" + userPokemon.pokemonMoveTwo + "<td>")

    userBattleRowTwo.append(userBattleMoveOne)
    userBattleRowTwo.append(userBattleMoveTwo)

    var userBattleRowThree = $("<tr>")
    var userBattleButtonOne = $("<td>" + "<input type='submit' value='Attack 1' id='userAttackOne'>" + "<td>")
    var userBattleButtonTwo = $("<td>" + "<input type='submit' value='Attack 2' id='userAttackTwo'>" + "<td>")

    userBattleRowThree.append(userBattleButtonOne)
    userBattleRowThree.append(userBattleButtonTwo)

    userBattleTable.append(userBattleRowOne)
    userBattleTable.append(userBattleRowTwo)
    userBattleTable.append(userBattleRowThree)

    $("#userPokeBattle").append($("<img src=" + userPokemon.pokemonImage + " id='userPokeImage'>"))
    $("#userPokeBattle").append($("<h1 id='userHealth'>Health: " + userPokemon.pokemonHealth + "<h1>"))
    $("#userPokeBattle").append(userBattleTable)

    /////////////////// APPEND HELLA THINGS TO CREATE random CARD //////////////////////////////
    var randBattleTable = $("<table class='table'>")
    randBattleTable.attr("id", "randBattleTable")

    var randBattleRowOne = $("<tr>")
    var randBattleMoveTitleOne = $("<th>Move Two<th>")
    var randBattleMoveTitleTwo = $("<th>Move One<th>")

    randBattleRowOne.append(randBattleMoveTitleOne)
    randBattleRowOne.append(randBattleMoveTitleTwo)

    var randBattleRowTwo = $("<tr>")
    var randBattleMoveOne = $("<td>" + randomPokemon.pokemonMoveOne + "<td>")
    var randBattleMoveTwo = $("<td>" + randomPokemon.pokemonMoveTwo + "<td>")

    randBattleRowTwo.append(randBattleMoveOne)
    randBattleRowTwo.append(randBattleMoveTwo)

    randBattleTable.append(randBattleRowOne)
    randBattleTable.append(randBattleRowTwo)

    $("#randPokeBattle").append($("<img src=" + randomPokemon.pokemonImage + " id='randPokeImage'>"))
    $("#randPokeBattle").append($("<h1 id='enemyHealth'>Health: " + randomPokemon.pokemonHealth + "<h1>"))
    $("#randPokeBattle").append(randBattleTable)
})

//Variable to keep track of move two uses
var count = 2;

//Add in functionality of first user attack (event listener for dynamically created elements)
document.addEventListener("click", function (e) {

    if (e.target && e.target.id == 'userAttackOne') {

        //Hide wait text if it is shown
        $("#waitText").attr('hidden', true)

        //check if user health is < 0, if it is don't run the function
        if (userPokemon.pokemonHealth <= 0) {
            return
        };

        //Do damage to enemy
        randomPokemon.pokemonHealth = randomPokemon.pokemonHealth - userPokemon.pokemonMoveOneDmg;
        $("#enemyHealth").text("Health: " + randomPokemon.pokemonHealth);
        //increase turn count
        count = count + 1;

        //check to see if enemy dead, if dead do win things and end function
        if (randomPokemon.pokemonHealth <= 0) {
            $("#randPokeBattle").empty();
            $("#randPokeBattle").append($("<h1>YOU WIN!!!!!!!!</h1>"));
            battleMusic.pause();
            victoryMusic.play();
            $("#waitText").attr('hidden', true);
            return
        }

        //Do return damage to user
        userPokemon.pokemonHealth = userPokemon.pokemonHealth - userPokemon.damageReceived;
        $("#userHealth").text("Health: " + userPokemon.pokemonHealth);

        //Check to see if user dead, if dead do lose things
        if (userPokemon.pokemonHealth <= 0) {
            $("#userPokeBattle").empty();
            $("#userPokeBattle").append($("<h1>YOU LOSE!!!!!!!!</h1>"));
            battleMusic.pause();
            failureMusic.play();
            $("#waitText").attr('hidden', true);
        }

    }
});

//Add in functionality of second user attack (event listener for dynamically created elements)
document.addEventListener("click", function (e) {

    if (e.target && e.target.id == 'userAttackTwo') {
        if (count >= 2) {

            //Hide wait text if it is shown
            $("#waitText").attr('hidden', true)

            //check if user health is < 0, if it is don't run the function
            if (userPokemon.pokemonHealth <= 0) {
                return
            }

            //Do damage to enemy
            randomPokemon.pokemonHealth = randomPokemon.pokemonHealth - userPokemon.pokemonMoveTwoDmg;
            $("#enemyHealth").text("Health: " + randomPokemon.pokemonHealth)
            //Reset count
            count = 0;

            //check to see if enemy dead, if dead do win things and end function
            if (randomPokemon.pokemonHealth <= 0) {
                $("#randPokeBattle").empty();
                $("#randPokeBattle").append($("<h1>YOU WIN!!!!!!!!</h1>"))
                battleMusic.pause();
                victoryMusic.play();
                $("#waitText").attr('hidden', true)
                return
            }

            //Do return damage to user
            userPokemon.pokemonHealth = userPokemon.pokemonHealth - userPokemon.damageReceived
            $("#userHealth").text("Health: " + userPokemon.pokemonHealth)

            //Check to see if user dead, if dead do lose things
            if (userPokemon.pokemonHealth <= 0) {
                $("#userPokeBattle").empty();
                $("#userPokeBattle").append($("<h1>YOU LOSE!!!!!!!!</h1>"))
                battleMusic.pause();
                failureMusic.play();
                $("#waitText").attr('hidden', true)
            }

        }
        else {
            $("#userPokeBattle").append($("<p id='waitText'>(Must wait 2 turns before using)</p>"))
            return
        }
    }
});

db.collection('pokeCount').orderBy('count','desc').limit(5).onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderPokemon(change.doc);
        }
    })
});

//================= reset button functionality ===================
$("#resetButton").on('click', function() {

    $("#pokemonType").text("");
    $("#pokemonAbility").text("");
    $("#pokemonMoveOne").text("");
    $("#pokemonMoveTwo").text("");
    $("#pokeName").text("");
    $("#pokeImageReal").attr("src", "");
    $("#userImage").attr("src","../Project/images/male-profile-image-placeholder.png");
    $("#user-image").val("");
    $(window).scrollTop(0);

    // referencing the id to hide the battle container
    $("#battleRow").attr("hidden", true);

    // appending the blank cells back into the table
    $("#pokemonType").append("<td>&nbsp</td>");
    $("#pokemonAbility").append("<td>&nbsp</td>");
    $("#pokemonMoveOne").append("<td>&nbsp</td>");
    $("#pokemonMoveTwo").append("<td>&nbsp</td>");

})



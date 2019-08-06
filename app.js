
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
                console.log(pokemonAvailable)

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

$(document).ready(function () {
    var CLOUNDINARY_URL = 'https://api.cloudinary.com/v1_1/da35qrt1i/upload';
    var CLOUNDINARY_UPLOAD_PRESET = 'zqc6zawb';
    $("#user-image").change(function (e) {
        // var uploadFile;
        // e.preventDefault();
        var uploadFile = e.target.files[0];
        // console.log(uploadFile);
        var formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('upload_preset', CLOUNDINARY_UPLOAD_PRESET);
        axios({
            url: CLOUNDINARY_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'applications/x-www-form-urlencoded'
            },
            data: formData
        }).then(function (res) {
            console.log(res.data.url);
        }).catch(function (err) {
            console.error(err);
        });
    });
});
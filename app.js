//Initialize function when user clicks anywhere on the document
$(document).on("click", function() {

//Defining count variable to iterate through ajax calls while avoidinguse of for loop (due to asynchronous-ness)
var count = 1;
//Create empty array to store ajax call results, end result should be array of pokemon called + details
var pokemonAvailable = []

//Function w/ ajax call to pull data on however many pokemon
function fetchPokemon(){
    
    // Here we construct our URL, and pick our pokemon by its 'id number' (pokedex number). In this case, we limit our results to the first 150 pokemon (OG) -- 50 for testing purposes
    var queryURL = "https://pokeapi.co/api/v2/pokemon/"+count+"/"

    // Write code to hit the queryURL with $ajax, 'GET' our returned results, and then take the response data
    // and console log the specific elements we are returning
    

    $.ajax({
      url: queryURL,
      method: 'GET'
    })
    // .then() => is a method from the Promise library that promises to execute a callback function. The callback => is going to capture the data that comes back from our AJAX call
    .then(function(response){
        //For each ajax call run, push the resulting details to our array outside of ajax
        pokemonAvailable.push(response)

        //Testing console logs + information we want to use in face comparison
        console.log(response.name)
        console.log(response.stats)
        console.log(response.height)
        console.log(response.weight)
        console.log(response.sprites.front_default)
        console.log(pokemonAvailable)
            
        if(count < 50){
            count = count + 1;
            console.log('BIG COUNT TOTAL:', count);
            fetchPokemon();
        }
    })

    var randomPoke = Math.floor(Math.random()*50)
    var randomPokeName = pokemonAvailable[randomPoke].name
    var randomPokeImg = pokemonAvailable[randomPoke].sprites.front_default
    console.log("Random Poke Name", randomPokeName )
    console.log("Random Poke Image", randomPokeImg)
    // return(randomPokeName, randomPokeImg)

    $("#pokeImage").html("<img src='"+randomPokeImg+"'>")
}

fetchPokemon();
});
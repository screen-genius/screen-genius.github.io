var movieName="friends";
var apiName="https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="+movieName;

fetch(apiName, {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "2bbe3f6662msh6816e85f5b1dd27p1e0fe8jsncb2c41fb7a72",
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
    }
})
.then(response => {
    console.log(response);
    return response.json();
})
.then(function(data){
    displayMovieAttr(data);
})
.catch(err => {
    console.error(err);
});

//displays Movie data
   function displayMovieAttr(data){
           
            var availableAt="";
            var resultName ="";
            var resultPicture=""
            resultName=data.results[0].name;
            resultPicture = data.results[0].picture;
            availableAt=data.results[0].locations[0].display_name;
            console.log(availableAt);
            console.log(resultPicture);
            console.log(resultName);

   } 
        
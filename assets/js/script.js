//gets data from API and returns the values
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
    var resultPicture="";
    var noOfMovies=data.results.length;
    var resultsToShow=[['nameResult', ""], ['photo', ""], ['availableloc', ""]];
    if(noOfMovies<3){
        n=noOfMovies;
    } else{
        n=3;
    }

//get 3 movies/shows available
    for (i=0;i<n;i++){
        resultName=data.results[i].name;
        resultPicture = data.results[i].picture;
        // push results onto the array 
        resultsToShow[i].nameResult=resultName;
        resultsToShow[i].photo=resultPicture;
        // where is the movie/show available (e.g. Netflix)
        for(j=0;j<3; j++) {
            availableAt=data.results[i].locations[j].display_name;
            resultsToShow[i].push(availableAt);
        }    
    }
//print the results
console.log(resultsToShow);
} 


// when the user searches the search should start with var movieName="friends";
//once the search is complete the array resultsToShow has the results. use it to show on html. 3 results are shown. 
        
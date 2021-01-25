//gets data from API and returns the values
var movieName="friends";
var apiName="https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="+movieName+"&country=ca";

fetch(apiName, {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "2bbe3f6662msh6816e85f5b1dd27p1e0fe8jsncb2c41fb7a72",
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
    }
})
.then(response => {
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
    var resultUrl="";
    var noOfMovies=data.results.length;
    console.log(noOfMovies);
    var resultsToShow=[['nameResult'], ['photo'], ['urlOf'],['availableloc']];
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
        resultsToShow[i].urlOf=resultUrl;
        // where is the movie/show available (e.g. Netflix)
        var sourceOfMovies=data.results[i].locations.length;
        for(j=0;j<sourceOfMovies; j++) {
            availableAt=data.results[i].locations[j].display_name;
            resultUrl = data.results[i].locations[j].url;
            resultsToShow[i].push(availableAt);
            resultsToShow[i].push(resultUrl);
        }    
    }
//print the results
console.log(resultsToShow);

} 

//getting attributes using ID

var imdbCode="tt0974015"; //enter the id
var imdbCodeurl = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id="+imdbCode+"&source=imdb&country=ca";
fetch(imdbCodeurl, {
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
    displayMovieAttrImdb(data);
})
.catch(err => {
    console.error(err);
    
});

function displayMovieAttrImdb(data){
    console.log(data);

    var movieNoArray =[['urlOfMovie'], ['locationMovie']];
    var movieName=data.collection.name;
    var moviePic=data.collection.picture;

    var movieUrl="";
    var movieLocation="";
    var movieLocationNo=data.collection.locations.length;
    console.log(movieLocationNo);
    for (i=0; i<movieLocationNo; i++){
        movieUrl=data.collection.locations[i].url;
        movieLocation=data.collection.locations[i].display_name;
        var arrayNew=[movieUrl, movieLocation];
        movieNoArray = movieNoArray.concat(arrayNew);
    }
    console.log(movieName);
    console.log(moviePic);
    console.log(movieNoArray);  

}


// when the user searches the search should start with var movieName="friends";
//once the search is complete the array resultsToShow has the results. use it to show on html. 3 results are shown.
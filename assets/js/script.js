var genreAreaEl = document.getElementById("genres-list");
var searchButtonEl = document.getElementById("search");
var moviedisplayEl = document.getElementById("movie-display");
var genres = [];
var tmdbCall = "https://api.themoviedb.org/3/discover/movie?api_key=fdf647e2a6c6b5d7ea2edb2acfe6abf1&language=en-US&vote_count.gte=100&vote_count.lte=1000&language=en&vote_average.gte=7&with_genres=";



function loadGenres() {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=fdf647e2a6c6b5d7ea2edb2acfe6abf1&language=en-US")
    .then(function(response){
        return response.json();        
    })
    .then(function(data){
        genres = data.genres;
        for (var i = 0; i < genres.length; i++) {
            let genreItemHolderEl = document.createElement("div");
            genreItemHolderEl.setAttribute("class", "ck-button");
            let genreItemLabelEl = document.createElement("label");

            let genreItemEl = document.createElement("input");
            genreItemEl.setAttribute("type", "checkbox");
            genreItemEl.setAttribute("value", genres[i].id)
            genreItemEl.setAttribute("id", genres[i].id);
            let genreItemTextEl = document.createElement("span");
            genreItemTextEl.textContent = genres[i].name;
            genreItemLabelEl.appendChild(genreItemEl);
            genreItemLabelEl.appendChild(genreItemTextEl);

            genreItemHolderEl.appendChild(genreItemLabelEl);
            genreAreaEl.appendChild(genreItemHolderEl); 

            searchButtonEl.addEventListener("click", fetchMovies);            
        }
    })
}

function setPageNo(genreNos){
    moviedisplayEl.textContent = "";
    let pageNo;
    for (var i = 0; i < 4; i++) {
        console.log(i);
        fetch(tmdbCall+genreNos)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            if (data.results.length === 0) {
                alert("Sorry too many genres. Try again.");
            } else {         
                console.log("total pages: " + data.total_pages);
                pageNo = Math.ceil(Math.random() * data.total_pages);
                console.log("page number: " + pageNo);
                console.log("total results: " + data.total_results + "  i: " + i);
                fetchMovieDetails(pageNo, genreNos);
            }
        })
        
    }
}

function collectGenres() {
    let theGenres = []
    for (var i = 0; i < genres.length; i++) {
        let genreCheck = document.getElementById(genres[i].id) ;
        if (genreCheck.checked) {
            theGenres.push(genres[i].id);
            genreCheck.checked = false;
        }
    }
    return theGenres.toString();
}

function fetchMovies() {
 
    let finalGenre = collectGenres();
    setPageNo(finalGenre);

}

function fetchMovieDetails(pageNo, finalGenre) {
    console.log("fetchMovieDetails - page no: "+pageNo);
    console.log(tmdbCall+finalGenre+"&page="+pageNo);
    fetch(tmdbCall+finalGenre+"&page="+pageNo)

    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        let results = data.results;
        let moviesPicked = [];
        let includedGenresArray = [];
        let movieObject;
        let randomMovieNum;
        let loopLength = 3;
        if (results.length < loopLength) {
            loopLength = results.length;
        }
        randomMovieNum = Math.floor(Math.random()*results.length);
        for(var j = 0; j < results[randomMovieNum].genre_ids.length; j++) {
            for (k = 0; k < genres.length; k++) {
                if (results[randomMovieNum].genre_ids[j]===genres[k].id){
                    includedGenresArray.push(genres[k].name);
                }
            }
        }
        let includedGenres = includedGenresArray.join(", ");
        includedGenresArray = [];
        movieObject = {title: results[randomMovieNum].title, 
                        poster: results[randomMovieNum].poster_path,
                        overview: results[randomMovieNum].overview,
                        genres: includedGenres,
                        rating: results[randomMovieNum].vote_average,
                        date: results[randomMovieNum].release_date,
                        tmdbId: results[randomMovieNum].id
                        };
        moviesPicked.push(movieObject);
        results.splice(randomMovieNum, 1)
        displayMovies(moviesPicked);
    })
}

function displayMovies(mArray) {
    for (var i = 0; i < mArray.length; i++){
        
        // create variables from array
        let title = mArray[i].title;
        let poster = mArray[i].poster;
        let overview = mArray[i].overview;
        let genres = mArray[i].genres;
        let date = mArray[i].date.substring(0, 4);
        let posterURL = "./assets/images/noPoster.png"
        if (poster) {
            posterURL="https://image.tmdb.org/t/p/w500"+poster;      
        }
        let tmdbId = mArray[i].tmdbId;


        // create card elements
        let cardEl = document.createElement("div");
        cardEl.setAttribute("class", "card");

        //add poster image
        let cardImageEl = document.createElement("div");
        cardImageEl.setAttribute("class", "card-image");
        let figureEl = document.createElement("figure")
        figureEl.setAttribute("class", "image is-3by4");
        let posterEl = document.createElement("img");
        posterEl.setAttribute("src", posterURL);
        //posterEl.setAttribute("alt", "");
        figureEl.appendChild(posterEl);
        cardImageEl.appendChild(figureEl);
        cardEl.appendChild(cardImageEl);

        // add text content
        let cardContentEl = document.createElement("div");
        cardContentEl.setAttribute("class", "card-content");
        let mediaContentEl = document.createElement("div");
        mediaContentEl.setAttribute("class", "media-content");
        let titleEl = document.createElement("h3");
        titleEl.setAttribute("class", "title is-4");
        titleEl.innerHTML = title + " <span class='date'>"+date+"</span>";
        mediaContentEl.appendChild(titleEl);

        let subtitleEl = document.createElement("h4");
        subtitleEl.setAttribute("class", "subtitle is-5");
        subtitleEl.textContent = genres;
        mediaContentEl.appendChild(subtitleEl);
        cardContentEl.appendChild(mediaContentEl);

        let contentEl = document.createElement("div");
        contentEl.setAttribute("class", "content");
        contentEl.textContent = overview;
        cardContentEl.appendChild(contentEl);

        cardEl.appendChild(cardContentEl);
        moviedisplayEl.appendChild(cardEl);

    }
}

loadGenres();


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
    var resultsToShow=[['nameResult',""], ['photo',"" ], ['urlOf', ""],['availableloc',""]];
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

var imdbCode="278"; //enter the id
var imdbCodeurl = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id=movie/"+imdbCode+"&source=tmdb&country=ca";
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

    var movieNoArray =[['urlOfMovie', ""], ['locationMovie', ""]];
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
  	// add location
	  let cardContentEl = document.createElement("div");
	  cardContentEl.setAttribute("class", "card-content");
	  let mediaContentEl = document.createElement("div");
	  mediaContentEl.setAttribute("class", "media-content");

	  let locationEl = document.createElement("h4");
	  locationEl.setAttribute("class", "subtitle is-6");
	  locationEl.textContent = availableAt;
	  mediaContentEl.appendChild(locationEl);
	  cardContentEl.appendChild(mediaContentEl);  

}



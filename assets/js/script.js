var genreAreaEl = document.getElementById("genres-list");
var searchButtonEl = document.getElementById("search");
var moviedisplayEl = document.getElementById("movie-display");
var genres = [];


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

function fetchMovies() {
    let firstID = true;
    let moreGenres = "";
    let finalGenre = "";
    for (var i = 0; i < genres.length; i++) {
        let genreCheck = document.getElementById(genres[i].id) ;
        if (genreCheck.checked) {
            finalGenre+= moreGenres + genres[i].id;
            genreCheck.checked = false;
            if (firstID === true) {
                firstID=false;
                moreGenres = ",";
            }
        }
    }
   fetch("https://api.themoviedb.org/3/discover/movie?api_key=fdf647e2a6c6b5d7ea2edb2acfe6abf1&sort_by=vote_average.desc&with_genres="+finalGenre)
   .then(function(response){
       return response.json();
    })
    .then(function(data){
        console.log(data);
        let results = data.results;
        if (results.length === 0) {
            alert("Sorry too many genres. Try again.");
        } else {
            console.log(results.length);
            let moviesPicked = [];
            let includedGenresArray = [];
            let movieObject;
            let randomMovieNum;
            let loopLength = 3;
            if (results.length < loopLength) {
                loopLength = results.length;
            }
            for (var i = 0; i < 3; i++) {
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
                               rating: results[randomMovieNum].vote_average
                              };
                moviesPicked.push(movieObject);
                results.splice(randomMovieNum, 1)
            }
            
            displayMovies(moviesPicked);
        }

    })


}

function displayMovies(mArray) {
    moviedisplayEl.textContent = "";
    for (var i = 0; i < mArray.length; i++){
        
        // create variables from array
        let title = mArray[i].title;
        let poster = mArray[i].poster;
        let overview = mArray[i].overview;
        let genres = mArray[i].genres;
        let posterURL = "./assets/images/noPoster.png"
        if (poster) {
            posterURL="https://image.tmdb.org/t/p/w500"+poster;      
        }


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
        titleEl.textContent = title;
        mediaContentEl.appendChild(titleEl);

        let subtitleEl = document.createElement("h4");
        subtitleEl.setAttribute("class", "subtitle is-6");
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

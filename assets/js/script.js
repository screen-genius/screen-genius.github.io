var genreAreaEl = document.getElementById("genres-list");
var searchButtonEl = document.getElementById("search");
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
        let results = data.results;
        let moviesPicked = [];
        let includedGenresArray = [];
        let movieObject;
        let randomMovieNum;
        let lastMovieNum;
        for (var i = 0; i < 3; i++) {
            randomMovieNum = Math.floor(Math.random()*results.length);
            if (randomMovieNum !== lastMovieNum) {
                for(var j = 0; j < results[randomMovieNum].genre_ids.length; j++) {
                    for (k = 0; k < genres.length; k++) {
                        if (results[randomMovieNum].genre_ids[j]===genres[k].id){
                            includedGenresArray.push(genres[k].name);
                        }
                    }
                }
                let includedGenres = includedGenresArray.toString();
                includedGenresArray = [];
                movieObject = {title: results[randomMovieNum].title, 
                               poster: results[randomMovieNum].poster_path,
                               overview: results[randomMovieNum].overview,
                               genres: includedGenres,
                               rating: results[randomMovieNum].vote_average

                            };
                moviesPicked.push(movieObject);
                lastMovieNum = randomMovieNum;
            } else if (results.length > 3) {
                i--;
            }
            

        }
        console.log(moviesPicked);

    })


}

loadGenres();

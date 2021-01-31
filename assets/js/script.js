var genreAreaEl = document.getElementById("genres-list");
var searchButtonEl = document.getElementById("search");

var tooManyGenresModalEl = document.getElementById("too-many-genres");
var genresOKButtonEl = document.getElementById("genres-OK-button");

var removeFavModalEl = document.getElementById("remove-fav");
var yesFavButtonEl = document.getElementById("yes-button");
var noFavButtonEl = document.getElementById("no-button");

var removeWatchModalEl = document.getElementById("remove-watch");
var yesWatButtonEl = document.getElementById("yes-w-button");
var noWatButtonEl = document.getElementById("no-w-button");

var pageTitleEl = document.getElementById("page-title");
var spinnerEl = document.getElementById("spinner");

var pageNo1;
var pageNo2;
var pageNo3;
var pageNo4;
var totalResults;
var countPages = 1;
var genreNos;
var results;
var tmdbId;
var genres = [];
var recentMovies = [];

var tmdbCall = "https://api.themoviedb.org/3/discover/movie?api_key=fdf647e2a6c6b5d7ea2edb2acfe6abf1&language=en-US&vote_count.gte=100&vote_count.lte=4000&language=en&vote_average.gte=7&with_genres=";
var duplicateChecker = [];

var watchlistDisplayEmpty=true;
var movieDisplayEmpty=true;
var favDisplayEmpty=true;

var displayCards = [{card: "movie-display",
					 lbFunction: "recentSave(this.id, 1)",
					 lbTextContent: "Add to Watchlist",
					 rbFunction: "recentSave(this.id, 2)",
					 rbTextContent: "Add to Favourites",
					 idPrefix: "card-"
					},
					{card: "watchlist-display",
					lbFunction: "removeWatch(this.id)",
					lbTextContent: "Remove from Watchlist",
					rbFunction: "watchToFav(this.id)",
					rbTextContent: "Move to Favourites",
					idPrefix: "watch-card-"
					},
					{card: "favourite-display",
					lbFunction: "removeFav(this.id)",
					lbTextContent: "Remove from Favourites",
					rbFunction: "favToWatch(this.id)",
					rbTextContent: "Move to Watchlist",
					idPrefix: "fav-card-"
				  	}];

var movies = {};

// Get genres from tmdb and add them to the DOM as check boxes (styled to look like buttons). 
function loadGenres() {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=fdf647e2a6c6b5d7ea2edb2acfe6abf1&language=en-US")
    .then(function(response){
        return response.json();        
    })
    .then(function(data){
        genres = data.genres;
        let buttonHolderEl;
        for (var i = 0; i < genres.length; i++) {
            let genreItemHolderEl = document.createElement("div");
            if (i%2 == 0) {
                buttonHolderEl = document.createElement("div");
                buttonHolderEl.setAttribute("class", "button-holder");
            }
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
            if (i%2 == 1 || i == genres.length-1) {
                buttonHolderEl.appendChild(genreItemHolderEl); 
                genreAreaEl.appendChild(buttonHolderEl);
            } else {
                buttonHolderEl.appendChild(genreItemHolderEl);
            }

            searchButtonEl.addEventListener("click", setPageNo);            
        }
    })
}

function resetVariables() {
    countPages = 1;
    pageNo1 = null;
    pageNo2 = null;
    pageNo3 = null;
	pageNo4 = null;
	spinnerEl.setAttribute("class", "modal");

}

//Pick a random movie from the page selected and get the Title, poster, release date, description, and where to watch information
function fetchMovieDetails(pageNo, finalGenre) {
 
	spinnerEl.setAttribute("class", "modal is-active");

    fetch(tmdbCall+finalGenre+"&page="+pageNo)

    .then(function(response){
        return response.json();
    })
    .then(function(data){
        results = data.results;


		let randomMovieNum = Math.floor(Math.random()*results.length);
		

		tmdbID = results[randomMovieNum].id;
		let hasDuplicate = duplicateChecker.some( check => check['tmdbId'] === tmdbID )

		if (hasDuplicate === true) {
			fetchMovieDetails(pageNo, finalGenre)
		} else {
			var tmdbCodeURL = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id=movie/"+tmdbID+"&source=tmdb&country=ca";
			fetch(tmdbCodeURL, {
				"method": "GET",
				"headers": {
					"x-rapidapi-key": "2bbe3f6662msh6816e85f5b1dd27p1e0fe8jsncb2c41fb7a72",
					"x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
				}
			})
			.then(response => {
				return response.json();
			})
			.then(function(utellyData){
				if (countPages ===2 && !pageNo3) {
					resetVariables();
					return;

				} else if (countPages ===3 && !pageNo4) {
					resetVariables();
					return;
				}  else if (countPages === 4) {
					resetVariables();
					return;
				} 
	   
				let locationInfo = utellyData.collection.locations;
				let includedGenresArray = [];
				let movieObject;
				for(var j = 0; j < results[randomMovieNum].genre_ids.length; j++) {
					for (k = 0; k < genres.length; k++) {
						if (results[randomMovieNum].genre_ids[j]===genres[k].id){
							includedGenresArray.push(genres[k].name);

						}
					}
				}


				let includedGenres = includedGenresArray.join(", ");
				includedGenresArray = [];
				for(var j = 0; j < results[randomMovieNum].genre_ids.length; j++) {
					for (k = 0; k < genres.length; k++) {
						if (results[randomMovieNum].genre_ids[j]===genres[k].id){
							includedGenresArray.push(genres[k].name);
						}
					}
				}
				let whereToWatchInfo = [];
				let whereToWatchItem;
				if (locationInfo) {
					for (i = 0; i < locationInfo.length; i++) {
						whereToWatchItem = {serviceName: locationInfo[i].display_name,
											serviceIcon: locationInfo[i].icon,
											serviceURL: locationInfo[i].url
						}
						whereToWatchInfo.push(whereToWatchItem);
					 }
				} else {
					let googleSearch = "https://www.google.com/search?q=movie+" + results[randomMovieNum].title.replace(/\s/g, '+') + "+" + results[randomMovieNum].release_date.substring(0, 4);
					whereToWatchInfo = ["Sorry we couldn't find a service that streams <em>" + results[randomMovieNum].title + ".</em> <br /><a href='" + googleSearch + "' target='_blank'>Click here to search for the title on Google</a>."];
				}
	
				movieObject = {title: results[randomMovieNum].title, 
								poster: results[randomMovieNum].poster_path,
								overview: results[randomMovieNum].overview,
								genres: includedGenres,
								rating: results[randomMovieNum].vote_average,
								date: results[randomMovieNum].release_date,
								whereToWatch: whereToWatchInfo,
								tmdbId: tmdbID
								};
				duplicateChecker.push(movieObject);		
			

				recentMovies.push(movieObject);
				pageTitleEl.textContent = "Search Results";
				displayMovies(movieObject, displayCards[0]);
				countPages++;
		
				//Runs the fetchMovieDetails function again, while avoiding asynchronous issues

				if(pageNo2 && countPages === 2) {
					fetchMovieDetails(pageNo2, genreNos);
					
				}
				if(pageNo3 && countPages === 3) {
					fetchMovieDetails(pageNo3, genreNos);
				}
					
				if(pageNo4 && countPages === 4) {
					fetchMovieDetails(pageNo4, genreNos);
		
				}
	
			})
			.catch(err => {
				console.error(err);
				
			});
	
		
		}


	})
		

}

// do an api call to find out how many pages there are and then add randomly generated page nos to pageNo variables
function setPageNo(){

	spinnerEl.setAttribute("class", "modal is-active");

	duplicateChecker = [];
    genreNos = collectGenres();
    fetch(tmdbCall+genreNos)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (data.results.length === 0) {
			spinnerEl.setAttribute("class", "modal")
            tooManyGenresModalEl.setAttribute("class", "is-active modal");
            genresOKButtonEl.addEventListener("click", function() {
                tooManyGenresModalEl.setAttribute("class", "modal");
            })
        } else {         
			totalResults = data.total_results;
			pageNo1 = Math.ceil(Math.random() * data.total_pages);   
			if (totalResults === 1) {
				pageNo1 = 1;
			} else if (totalResults === 2) {
				pageNo1 = 1;
				pageNo2 = 1;
			} else if (totalResults === 3) {
				pageNo1 = 1;
				pageNo2 = 1;
				pageNo3 = 1;
			} else if (totalResults <= 20) {
				pageNo1 = 1;
				pageNo2 = 1;
				pageNo3 = 1;
				pageNo4 = 1;
			} else if (totalResults <= 40) {
				pageNo1 = 1;
				pageNo2 = 1;
				pageNo3 = 2;
				if (totalResults === 21) {
					pageNo4 = 1;
				} else {
					pageNo4 = 2;
				}
			} else if (totalResults <= 60) {
				pageNo1 = 1;
				pageNo2 = 2;
				pageNo3 = 3;
				pageNo4 = Math.ceil(Math.random() * data.total_pages-1);
			} else if (totalResults <= 80) {
				pageNo1 = 1;
				pageNo2 = 2;
				pageNo3 = 3;
				pageNo4 = 4; 
			} else {
				pageNo1 = Math.ceil(Math.random() * data.total_pages);   
				do {
					pageNo2 = Math.ceil(Math.random() * data.total_pages);
				} while (pageNo1 === pageNo2);
				do {
					pageNo3 = Math.ceil(Math.random() * data.total_pages);
				} while (pageNo1 === pageNo3 || pageNo2 === pageNo3);
				
				do {
					pageNo4 = Math.ceil(Math.random() * data.total_pages);
				} while (pageNo1 === pageNo4 || pageNo2 === pageNo4 || pageNo3 === pageNo4); 
			}
            
      fetchMovieDetails(pageNo1, genreNos);

        }
    })
        
}


function collectGenres() {
    let theGenres = []
    for (var i = 0; i < genres.length; i++) {
        let genreCheck = document.getElementById(genres[i].id);
        if (genreCheck.checked) {
            theGenres.push(genres[i].id);
            genreCheck.checked = false;
        }
    }
    return theGenres.toString();
}


function displayMovies(movieObject, cardObject) {

	let displayEl = document.getElementById(cardObject.card);
	if ((movieDisplayEmpty === true && cardObject.card == "movie-display")||
		(watchlistDisplayEmpty === true && cardObject.card == "watchlist-display") ||
		(favDisplayEmpty === true && cardObject.card == "favourite-display")
	) {
		displayEl.textContent = "";
		movieDisplayEmpty = false;
	}
        
	// create variables from array
	let title = movieObject.title;
	let overview = movieObject.overview;
	let genres = movieObject.genres;
	let rating = movieObject.rating;
	let date = movieObject.date.substring(0, 4);
	let tmdbId = movieObject.tmdbId;
	let poster = movieObject.poster;
	let posterURL = "./assets/images/noPoster.png";
	if (poster) {
		posterURL="https://image.tmdb.org/t/p/w500"+poster;      
	}
	let whereToWatch = movieObject.whereToWatch;


	// create card elements
	let cardEl = document.createElement("div");
	cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
	cardEl.setAttribute("id", cardObject.idPrefix+tmdbId);
	//add poster image
	let cardImageEl = document.createElement("div");
	cardImageEl.setAttribute("class", "card-image is-3");
	let figureEl = document.createElement("figure")
	figureEl.setAttribute("class", "image");
	let posterEl = document.createElement("img");
	posterEl.setAttribute("src", posterURL);
	posterEl.setAttribute("alt", "Poster " + title);
	figureEl.appendChild(posterEl);
	cardImageEl.appendChild(figureEl);
	cardEl.appendChild(cardImageEl);

	// add text content
	let cardContentEl = document.createElement("div");
	cardContentEl.setAttribute("class", "card-content is-9");
	let mediaContentEl = document.createElement("div");
	mediaContentEl.setAttribute("class", "media-content");
	let titleEl = document.createElement("h3");
	titleEl.setAttribute("class", "title is-2 has-text-weight-bold has-text-white");
	titleEl.innerHTML = title + " <span class='date has-text-weight-light has-text-white'>"+date+"</span>";
	mediaContentEl.appendChild(titleEl);

	let subtitleEl = document.createElement("h4");
	subtitleEl.setAttribute("class", "subtitle is-5 has-text-white");
	subtitleEl.innerHTML = genres + "<br />  <span class='rating has-text-weight-light'>" + rating + "/10</span>";
	mediaContentEl.appendChild(subtitleEl);
	cardContentEl.appendChild(mediaContentEl);

	let contentEl = document.createElement("div");
	contentEl.setAttribute("class", "content has-text-grey-light");
	contentEl.textContent = overview;
	cardContentEl.appendChild(contentEl);


	let whereToWatchEl = document.createElement("div");
	let whereToWatchTitleEl = document.createElement("h4");
	whereToWatchTitleEl.setAttribute("class", "subtitle is-5 has-text-white");
	whereToWatchTitleEl.textContent = "Where to watch:";
	whereToWatchEl.appendChild(whereToWatchTitleEl);
	
	let iconHolder = document.createElement("div");
	iconHolder.setAttribute("class", "icon-holder");

	if (typeof whereToWatch[0] === "object") {
		for (j = 0; j < whereToWatch.length; j++) {
			let whereToWatchIconEl = document.createElement("div");
			let watchID = whereToWatch[j].serviceName;
			watchID = watchID.replace(/\s+/g, '-').toLowerCase();
			whereToWatchIconEl.setAttribute("id", watchID+"-"+tmdbId);
			whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
			whereToWatchIconEl.innerHTML= "<a href='" + whereToWatch[j].serviceURL+"' target='_blank'><img src='" + whereToWatch[j].serviceIcon + "' alt='" + whereToWatch[j].serviceName + "' /></a>";
			iconHolder.appendChild(whereToWatchIconEl);
		}                
	} else {
		let whereToWatchNoOptionsEl = document.createElement("div");
		whereToWatchNoOptionsEl.innerHTML = movieObject.whereToWatch[0];
		iconHolder.appendChild(whereToWatchNoOptionsEl);
	}

	
	let leftButtonEl = document.createElement("button");
	leftButtonEl.setAttribute("id", tmdbId);
	leftButtonEl.setAttribute("class", "button mr-3 mb-5");
	leftButtonEl.setAttribute("onclick", cardObject.lbFunction);
	leftButtonEl.textContent = cardObject.lbTextContent;
	cardContentEl.appendChild(leftButtonEl);

	let rightButtonEl = document.createElement("button");
	rightButtonEl.setAttribute("id", tmdbId);
	rightButtonEl.setAttribute("class", "button mr-3 mb-5");
	rightButtonEl.setAttribute("onclick", cardObject.rbFunction);
	rightButtonEl.textContent = cardObject.rbTextContent;
	cardContentEl.appendChild(rightButtonEl);

	whereToWatchEl.appendChild(iconHolder);
	cardContentEl.appendChild(whereToWatchEl);

	cardEl.appendChild(cardContentEl);
	displayEl.appendChild(cardEl);

	spinnerEl.setAttribute("class", "modal");


}

// WATCH LIST AND FAVOURITES LIST CREATION STARTS
var saveSearch = function() {
	localStorage.setItem("movies", JSON.stringify(movies));
}

var loadMovies = function() {

	movies = JSON.parse(localStorage.getItem("movies"));

	if (!movies) {
		movies = {
			favourites: [],
			watchlist: []
		}
	}

	if (movies.favourites.length) {
		loadStoredMovies(movies.favourites, 2); 
	}

	if (movies.watchlist.length) {
		loadStoredMovies(movies.watchlist, 1); 
	}



}

var loadStoredMovies = function(moviesToLoad, displayNo) {
	let displayEl;
	if (moviesToLoad.length > 0 ) {
		if (displayNo == 2) {
			displayEl = document.getElementById("favourite-display");
			favDisplayEmpty=false;
		} else {
			displayEl = document.getElementById("watchlist-display");
			watchlistDisplayEmpty = false;
		}
		displayEl.textContent = "";
		for (var i = 0; i < moviesToLoad.length; i++) {

			displayMovies(moviesToLoad[i], displayCards[displayNo]);

		} // END OF FOR LOOP
	}// END OF IF 
}


// MOVING FROM SEARCH RESULTS TO FAVOURITES OR WATCHLIST LIST
var recentSave = function(clicked_id, cardNo) {
	var id = document.getElementById(clicked_id).id;

	for (var i = 0; i < recentMovies.length; i++) {
	
		var recentId = recentMovies[i].tmdbId;
		if (id == recentId) {

			let displayEl = document.getElementById("movie-display")

			displayMovies(recentMovies[i], displayCards[cardNo]);

			if(cardNo == 1) {
				movies.watchlist.push(recentMovies[i]);
				watchlistDisplayEmpty = false;
			} else {
				movies.favourites.push(recentMovies[i]);
				favDisplayEmpty = false;
			}

			//remove object from aray position [i]
			recentMovies.splice(i, 1);

			//remove card from recentlist
			var deleteitem = document.getElementById("card-"+id);
			deleteitem.remove();

			if(recentMovies.length===0){
				displayEl.textContent = "Pick from your favourite genres on the left and press search to find hidden gem movies to watch. Or just press search for great movie ideas from any genre.";
				movieDisplayEmpty = true;
			}

	
			saveSearch();
		}
	}//end of for loop
}


//ADDING FROM FAVOURITES TO WATCHLIST
var favToWatch = function(clicked_id) {
	var favId = document.getElementById(clicked_id).id;
	let displayEl = document.getElementById("favourite-display");


	for (var i = 0; i < movies.favourites.length; i++) {

		var recentId = movies.favourites[i].tmdbId;
		

		if (favId == recentId) {


			//display movie under watchlist on screen
			displayMovies(movies.favourites[i], displayCards[1]);
			watchlistDisplayEmpty = false;

			//move object [i] from favourites array to watchlist array  
			movies.watchlist.push(movies.favourites[i]);
			movies.favourites.splice(i, 1);

			//remove card from favourites display area
			var deleteitem = document.getElementById("fav-card-"+favId);
			deleteitem.remove();

			//check if favourites area is blank. If yes insert default text
			if (movies.favourites.length == 0){
				displayEl.textContent = "No movies in your Favourites.";
				favDisplayEmpty = true;
			}


			saveSearch();

		}//end of if
	}//end of for loop
}

//ADDING FROM WATCHLIST TO FAVOURITES
var watchToFav = function(clicked_id) {
	var watchId = document.getElementById(clicked_id).id;
	let displayEl = document.getElementById("watchlist-display");


	for (var i = 0; i < movies.watchlist.length; i++) {

		var recentId = movies.watchlist[i].tmdbId;
		

		if (watchId == recentId) {

			//display movie under favourites on screen
			displayMovies(movies.watchlist[i], displayCards[2]);
			favDisplayEmpty = false;

			//move object [i] from watchlist array to favourites array  
			movies.favourites.push(movies.watchlist[i]);
			movies.watchlist.splice(i, 1);

			//remove card from watchlist display area
			var deleteitem = document.getElementById("watch-card-"+watchId);
			deleteitem.remove();	
			
			//check if watchlist area is blank. If yes insert default text
			if (movies.watchlist.length == 0){
				displayEl.textContent = "No movies in your Watchlist.";
				watchlistDisplayEmpty = true;
			}
			

			saveSearch();

			// loadWatchlist();

		}//end of if 
	}//end of for loop
}

// REMOVE FROM FAVOURITES LIST
var removeFav = function(this_id) {

	removeFavModalEl.setAttribute("class", "is-active modal");


	yesFavButtonEl.onclick = function() {
		
		let displayEl = document.getElementById("favourite-display");
		movies = JSON.parse(localStorage.getItem("movies"));

		var removeItem = movies.favourites.map(function(item) {return item.tdmbId;}).indexOf(this_id);

		movies.favourites.splice(removeItem, 1)

		var deleteitem = document.getElementById("fav-card-"+this_id);
		deleteitem.remove();

		saveSearch();

		if (movies.favourites.length == 0){
			displayEl.textContent = "No movies in your Favourites.";
			favDisplayEmpty = true;
		}
		removeFavModalEl.setAttribute("class", "modal");


	}
	noFavButtonEl.onclick = function() {
	    removeFavModalEl.setAttribute("class", "modal");
	}
}

// REMOVE FROM WATCHLIST
var removeWatch = function(this_id) {

removeWatchModalEl.setAttribute("class", "is-active modal");
		
	yesWatButtonEl.onclick = function() {

		let displayEl = document.getElementById("watchlist-display");

		movies = JSON.parse(localStorage.getItem("movies"));

		var removeItem = movies.watchlist.map(function(item) {return item.tdmbId;}).indexOf(this_id);

		movies.watchlist.splice(removeItem, 1)

		var deleteitem = document.getElementById("watch-card-"+this_id);
		deleteitem.remove();

		saveSearch();

		if (movies.watchlist.length == 0){
			displayEl.textContent = "No movies in your Watchlist.";
			watchlistDisplayEmpty = true;
		}


		removeWatchModalEl.setAttribute("class", "modal");
	}
	
	noWatButtonEl.onclick = function() {
		removeWatchModalEl.setAttribute("class", "modal");
	}
}

// END OF WATCHLIST AND FAVOURITES LIST 

loadGenres();
loadMovies();
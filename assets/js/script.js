var genreAreaEl = document.getElementById("genres-list");
var searchButtonEl = document.getElementById("search");
var moviedisplayEl = document.getElementById("movie-display");
var favDisplayEl = document.getElementById("favourite-display");
var watchlistDisplayEl = document.getElementById("watchlist-display");
var tooManyGenresModalEl = document.getElementById("too-many-genres");
var genresOKButtonEl = document.getElementById("genres-OK-button");
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
var tmdbCall = "https://api.themoviedb.org/3/discover/movie?api_key=fdf647e2a6c6b5d7ea2edb2acfe6abf1&language=en-US&vote_count.gte=100&vote_count.lte=1000&language=en&vote_average.gte=7&with_genres=";

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
}

//Pick a random movie from the page selected and get the Title, poster, release date, description, and where to watch information
function fetchMovieDetails(pageNo, finalGenre) {
 

    fetch(tmdbCall+finalGenre+"&page="+pageNo)

    .then(function(response){
        return response.json();
    })
    .then(function(data){
        results = data.results;

        let randomMovieNum = Math.floor(Math.random()*results.length);


        tmdbID = results[randomMovieNum].id;

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
                console.log("first")
                resetVariables();
                return;
            } else if (countPages ===3 && !pageNo4) {
                console.log("second")
                resetVariables();
                return;
            }  else if (countPages === 4) {
                console.log("third")
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
                whereToWatchInfo = ["Sorry we couldn't find a service that streams <em>" + results[randomMovieNum].title + ".</em>"];
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
							
			console.log(locationInfo);
			
			//google where to watch display info
			if (locationInfo) 
			{			
				for (y = 0; y < locationInfo.length; y++) {
				if (locationInfo[y].display_name === "Google Play") {
					var googlename = locationInfo[y].display_name;
					var googleicon = locationInfo[y].icon;
					var googleurl = locationInfo[y].url;
				}
				}
			

			//apple where to watch display info
			 			
				for (r = 0; r < locationInfo.length; r++) {
				if (locationInfo[r].display_name === "Disney") {
					var disneyname = locationInfo[r].display_name;
					var disneyicon = locationInfo[r].icon;
					var disneyurl = locationInfo[r].url;
				}
				}
			

			//itunes where to watch display info
				
				for (w = 0; w < locationInfo.length; w++) {
				if (locationInfo[w].display_name === "iTunes") {
					var itunesname = locationInfo[w].display_name;
					var itunesicon = locationInfo[w].icon;
					var itunesurl = locationInfo[w].url;
				}
				}
			

			//Amazon where to watch display info
						
				for (f = 0; f < locationInfo.length; f++) {
				if (locationInfo[f].display_name === "Amazon Prime Video") {
					var amazonname = locationInfo[f].display_name;
					var amazonicon = locationInfo[f].icon;
					var amazonurl = locationInfo[f].url;
				}
			}
		}
			

            movies.recentmovies.push(
                {	title: results[randomMovieNum].title, 
                    poster: results[randomMovieNum].poster_path,
                    overview: results[randomMovieNum].overview,
					genres: includedGenres,
					servicegoogle: googlename,
					servicegoogleicon: googleicon,
					servicegoogleurl: googleurl,
					serviceamazon: amazonname,
					serviceamazonicon: amazonicon,
					serviceamazonurl: amazonurl,
					serviceitunes: itunesname,
					serviceitunesicon: itunesicon,
					serviceitunesurl: itunesurl,
					servicedisney: disneyname,
					servicedisneyicon: disneyicon,
					servicedisneyurl: disneyurl,
                    rating: results[randomMovieNum].vote_average,
                    date: results[randomMovieNum].release_date,
                    tmdbId: ""+results[randomMovieNum].id+"" })
            saveSearch();
    
            displayMovies(movieObject);
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

    
    })
}

// do an api call to find out how many pages there are and then add randomly generated page nos to pageNo variables
function setPageNo(){
    genreNos = collectGenres();
    fetch(tmdbCall+genreNos)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (data.results.length === 0) {
            tooManyGenresModalEl.setAttribute("class", "is-active modal");
            genresOKButtonEl.addEventListener("click", function() {
                tooManyGenresModalEl.setAttribute("class", "modal");
            })
        } else {         
            moviedisplayEl.textContent = "";
            totalResults = data.total_results;
            pageNo1 = Math.ceil(Math.random() * data.total_pages);    
            if (totalResults >= 2) {
                pageNo2 = Math.ceil(Math.random() * data.total_pages); 
            }
            if (totalResults >= 3) {
                pageNo3 = Math.ceil(Math.random() * data.total_pages);
            }    
            if (totalResults >= 4) {
                pageNo4 = Math.ceil(Math.random() * data.total_pages); 
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

function displayMovies(movieObject) {
        
        // create variables from array
        let title = movieObject.title;
        let poster = movieObject.poster;
        let overview = movieObject.overview;
        let genres = movieObject.genres;
        let date = movieObject.date.substring(0, 4);
        let posterURL = "./assets/images/noPoster.png"
        if (poster) {
            posterURL="https://image.tmdb.org/t/p/w500"+poster;      
        }
        let tmdbId = ""+movieObject.tmdbId+"";


        // create card elements
        let cardEl = document.createElement("div");
        cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
        cardEl.setAttribute("id", "card-"+tmdbId)

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
        subtitleEl.textContent = genres;
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
		let whereToWatchIconEl;

		// Display where to watch
		var n = movies.recentmovies.length - 1;

		if (movies.recentmovies[n].serviceamazon === "Amazon Prime Video") {
			let watchID = movies.recentmovies[n].serviceamazon;
			whereToWatchIconEl = document.createElement("div");
			watchID = watchID.replace(/\s+/g, '-').toLowerCase();
			whereToWatchIconEl.setAttribute("id", watchID+"-"+n);
			whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
			whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[n].serviceamazonurl+"' target='_blank'><img src='" + movies.recentmovies[n].serviceamazonicon + "' alt='" + movies.recentmovies[n].serviceamazon + "' /></a>";
			iconHolder.appendChild(whereToWatchIconEl);
		}   

		if (movies.recentmovies[n].serviceitunes === "iTunes") {
			let watchID = movies.recentmovies[n].serviceitunes;
			whereToWatchIconEl = document.createElement("div");
			watchID = watchID.replace(/\s+/g, '-').toLowerCase();
			whereToWatchIconEl.setAttribute("id", watchID+"-"+n);
			whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
			whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[n].serviceitunesurl+"' target='_blank'><img src='" + movies.recentmovies[n].serviceitunesicon + "' alt='" + movies.recentmovies[n].serviceitunes + "' /></a>";
			iconHolder.appendChild(whereToWatchIconEl); 
		}     
		
		if (movies.recentmovies[n].servicegoogle === "Google Play") {
			let watchID = movies.recentmovies[n].servicegoogle;
			whereToWatchIconEl = document.createElement("div");
			watchID = watchID.replace(/\s+/g, '-').toLowerCase();
			whereToWatchIconEl.setAttribute("id", watchID+"-"+n);
			whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
			whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[n].servicegoogleurl+"' target='_blank'><img src='" + movies.recentmovies[n].servicegoogleicon + "' alt='" + movies.recentmovies[n].servicegoogle + "' /></a>";
			iconHolder.appendChild(whereToWatchIconEl);
		} else {
		let whereToWatchNoOptionsEl = document.createElement("div");
		whereToWatchNoOptionsEl.innerHTML = movieObject.whereToWatch[0];
		iconHolder.appendChild(whereToWatchNoOptionsEl);
		}
		
		let buttonWatchEl = document.createElement("button");
		buttonWatchEl.setAttribute("id", tmdbId);
		buttonWatchEl.setAttribute("class", "button mr-3 mb-5")
		buttonWatchEl.setAttribute("onclick", "recentSaveWatch(this.id)");
		buttonWatchEl.textContent = "Add to Watchlist";
		cardContentEl.appendChild(buttonWatchEl);

        let buttonFavEl = document.createElement("button");
		buttonFavEl.setAttribute("id", tmdbId);
		buttonFavEl.setAttribute("class", "button mb-5")
		buttonFavEl.setAttribute("onclick", "recentSaveFav(this.id)");
		buttonFavEl.textContent = "Add to Favourites";
		cardContentEl.appendChild(buttonFavEl);
	
		whereToWatchEl.appendChild(iconHolder);
		cardContentEl.appendChild(whereToWatchEl);

        cardEl.appendChild(cardContentEl);
        moviedisplayEl.appendChild(cardEl);

}

// WATCH LIST AND FAVOURITES LIST CREATION STARTS
var saveSearch = function() {
	localStorage.setItem("movies", JSON.stringify(movies));
}

/*
// var clearRecentMovies = function() {
// 	if (movies.recentmovies.length > 0) {
// 		movies.recentmovies.length = 0;
// 	}*/

var loadMovies = function() {

	movies = JSON.parse(localStorage.getItem("movies"));

	if (!movies) {
		movies = {
			recentmovies: [],
			favourites: [],
			watchlist: []
		}
	}

	if (movies.favourites.length) {
		loadFavourites(); 
	}

	if (movies.watchlist.length) {
		loadWatchlist(); 
	}

	console.log(movies);


}

var loadFavourites = function() {
	//LOAD MOVIES IN FAVOURITES
	movies = JSON.parse(localStorage.getItem("movies"));

	if (movies.favourites.length > 0 ) {
		favDisplayEl.textContent = "";
		for (var i = 0; i < movies.favourites.length; i++) {

			let title = movies.favourites[i].title;
			let poster = movies.favourites[i].poster;
			let overview = movies.favourites[i].overview;
			let genres = movies.favourites[i].genres;
			let date = movies.favourites[i].date.substring(0, 4);
			let posterURL = "./assets/images/noPoster.png"
			if (poster) {
				posterURL="https://image.tmdb.org/t/p/w500"+poster;      
			}
			let tmdbId = movies.favourites[i].tmdbId;
			//let movieIdAttribute = movies.recentmovies[i].movieObject.tmdbId;
	
			// create card elements
			let cardEl = document.createElement("div");
			cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
			//cardEl.setAttribute("id", movieIdAttribute)
			cardEl.setAttribute("id", "fav-card-"+tmdbId)
	
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
			subtitleEl.textContent = genres;
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
			let whereToWatchIconEl;
	
			// Display where to watch
	
			if (movies.favourites[i].serviceamazon === "Amazon Prime Video") {
				let watchID = movies.favourites[i].serviceamazon;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+tmdbId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.favourites[i].serviceamazonurl+"' target='_blank'><img src='" + movies.favourites[i].serviceamazonicon + "' alt='" + movies.favourites[i].serviceamazon + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			}   
	
			if (movies.favourites[i].serviceitunes === "iTunes") {
				let watchID = movies.favourites[i].serviceitunes;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+tmdbId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.favourites[i].serviceitunesurl+"' target='_blank'><img src='" + movies.favourites[i].serviceitunesicon + "' alt='" + movies.favourites[i].serviceitunes + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl); 
			}     
			
			if (movies.favourites[i].servicegoogle === "Google Play") {
				let watchID = movies.favourites[i].servicegoogle;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+tmdbId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.favourites[i].servicegoogleurl+"' target='_blank'><img src='" + movies.favourites[i].servicegoogleicon + "' alt='" + movies.favourites[i].servicegoogle + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			} else {
			let whereToWatchNoOptionsEl = document.createElement("div");
			whereToWatchNoOptionsEl.innerHTML = movies.recentmovies[0];
			iconHolder.appendChild(whereToWatchNoOptionsEl);
			}
		
			let buttonEl = document.createElement("button");
			buttonEl.setAttribute("id", tmdbId);
			buttonEl.setAttribute("onclick", "removeFav(this.id)");
			buttonEl.textContent = "Remove From Favourites";
			cardContentEl.appendChild(buttonEl);

			let buttonWatchEl = document.createElement("button");
			buttonWatchEl.setAttribute("id", tmdbId);
			buttonWatchEl.setAttribute("onclick", "favSaveWatch(this.id)");
			buttonWatchEl.textContent = "Add To Watchlist";
			cardContentEl.appendChild(buttonWatchEl);
	
			cardEl.appendChild(cardContentEl);
			favDisplayEl.appendChild(cardEl);

			whereToWatchEl.appendChild(iconHolder);
			cardContentEl.appendChild(whereToWatchEl);
		} // END OF FOR LOOP
	}// END OF IF 
}

var loadWatchlist = function() {
	//LOAD MOVIES IN WATCHLIST
	movies = JSON.parse(localStorage.getItem("movies"));

	if (movies.watchlist.length > 0 ) {
		watchlistDisplayEl.textContent = "";
		for (var i = 0; i < movies.watchlist.length; i++) {

			let title = movies.watchlist[i].title;
			let poster = movies.watchlist[i].poster;
			let overview = movies.watchlist[i].overview;
			let genres = movies.watchlist[i].genres;
			let date = movies.watchlist[i].date.substring(0, 4);
			let posterURL = "./assets/images/noPoster.png"
			if (poster) {
				posterURL="https://image.tmdb.org/t/p/w500"+poster;      
			}
			let tmdbId = movies.watchlist[i].tmdbId;
			//let movieIdAttribute = movies.recentmovies[i].movieObject.tmdbId;
	
			// create card elements
			let cardEl = document.createElement("div");
			cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
			//cardEl.setAttribute("id", movieIdAttribute)
			cardEl.setAttribute("id", "watch-card-"+tmdbId)
	
			//add poster image
			let cardImageEl = document.createElement("div");
			cardImageEl.setAttribute("class", "card-image is-3");
			let figureEl = document.createElement("figure")
			figureEl.setAttribute("class", "image");
			let posterEl = document.createElement("img");
			posterEl.setAttribute("src", posterURL);
			posterEl.setAttribute("alt", "Poster " + title);
			//posterEl.setAttribute("class", "image");
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
			subtitleEl.textContent = genres;
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
			let whereToWatchIconEl;
	
			// Display where to watch
	
			if (movies.watchlist[i].serviceamazon === "Amazon Prime Video") {
				let watchID = movies.watchlist[i].serviceamazon;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+tmdbId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.watchlist[i].serviceamazonurl+"' target='_blank'><img src='" + movies.watchlist[i].serviceamazonicon + "' alt='" + movies.watchlist[i].serviceamazon + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			}   
	
			if (movies.watchlist[i].serviceitunes === "iTunes") {
				let watchID = movies.watchlist[i].serviceitunes;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+tmdbId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.watchlist[i].serviceitunesurl+"' target='_blank'><img src='" + movies.watchlist[i].serviceitunesicon + "' alt='" + movies.watchlist[i].serviceitunes + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl); 
			}     
			
			if (movies.watchlist[i].servicegoogle === "Google Play") {
				let watchID = movies.watchlist[i].servicegoogle;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+tmdbId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.watchlist[i].servicegoogleurl+"' target='_blank'><img src='" + movies.watchlist[i].servicegoogleicon + "' alt='" + movies.watchlist[i].servicegoogle + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			} else {
			let whereToWatchNoOptionsEl = document.createElement("div");
			whereToWatchNoOptionsEl.innerHTML = movies.recentmovies[0];
			iconHolder.appendChild(whereToWatchNoOptionsEl);
			}
		
			let buttonEl = document.createElement("button");
			buttonEl.setAttribute("id", tmdbId);
			buttonEl.setAttribute("onclick", "removeWatch(this.id)");
			buttonEl.textContent = "Remove From Watchlist";
			cardContentEl.appendChild(buttonEl);

			let buttonWatchEl = document.createElement("button");
			buttonWatchEl.setAttribute("id", tmdbId);
			buttonWatchEl.setAttribute("onclick", "watchSaveFav(this.id)");
			buttonWatchEl.textContent = "Add To Favourites";
			cardContentEl.appendChild(buttonWatchEl);
	
			cardEl.appendChild(cardContentEl);
			watchlistDisplayEl.appendChild(cardEl);

			whereToWatchEl.appendChild(iconHolder);
			cardContentEl.appendChild(whereToWatchEl);
		} // END OF FOR LOOP
	}
}//END OF LOADWATCHLIST

// ADDING FROM RECENT TO FAVOURITES LIST
var recentSaveFav = function(clicked_id) {
	var favId = document.getElementById(clicked_id).id;

	movies = JSON.parse(localStorage.getItem("movies"));

	for (var i = 0; i < movies.recentmovies.length; i++) {
	
		var recentId = ""+movies.recentmovies[i].tmdbId+"";

		if (favId === recentId) {

			let title = movies.recentmovies[i].title;
			let poster = movies.recentmovies[i].poster;
			let overview = movies.recentmovies[i].overview;
			let genres = movies.recentmovies[i].genres;
			let date = movies.recentmovies[i].date.substring(0, 4);
			let posterURL = "./assets/images/noPoster.png"
			if (poster) {
				posterURL="https://image.tmdb.org/t/p/w500"+poster;      
			}
			let tmdbId = movies.recentmovies[i].tmdbId;
			//let movieIdAttribute = movies.recentmovies[i].movieObject.tmdbId;
	
			// create card elements
			let cardEl = document.createElement("div");
			cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
			//cardEl.setAttribute("id", movieIdAttribute)
			cardEl.setAttribute("id", "fav-card-"+tmdbId)
	
	
			//add poster image
			let cardImageEl = document.createElement("div");
			cardImageEl.setAttribute("class", "card-image is-3");
			let figureEl = document.createElement("figure")
			figureEl.setAttribute("class", "image");
			let posterEl = document.createElement("img");
			posterEl.setAttribute("src", posterURL);
			posterEl.setAttribute("alt", "Poster " + title);
			//posterEl.setAttribute("class", "image");
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
			subtitleEl.textContent = genres;
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
			let whereToWatchIconEl;
	
			// Display where to watch
			var indexId = movies.recentmovies[i].tmdbId;
	
			if (movies.recentmovies[i].serviceamazon === "Amazon Prime Video") {
				let watchID = movies.recentmovies[i].serviceamazon;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[i].serviceamazonurl+"' target='_blank'><img src='" + movies.recentmovies[i].serviceamazonicon + "' alt='" + movies.recentmovies[i].serviceamazon + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			}   
	
			if (movies.recentmovies[i].serviceitunes === "iTunes") {
				let watchID = movies.recentmovies[i].serviceitunes;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[i].serviceitunesurl+"' target='_blank'><img src='" + movies.recentmovies[i].serviceitunesicon + "' alt='" + movies.recentmovies[i].serviceitunes + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl); 
			}     
			
			if (movies.recentmovies[i].servicegoogle === "Google Play") {
				let watchID = movies.recentmovies[i].servicegoogle;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[i].servicegoogleurl+"' target='_blank'><img src='" + movies.recentmovies[i].servicegoogleicon + "' alt='" + movies.recentmovies[i].servicegoogle + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			} else {
			let whereToWatchNoOptionsEl = document.createElement("div");
			whereToWatchNoOptionsEl.innerHTML = movies.recentmovies[0];
			iconHolder.appendChild(whereToWatchNoOptionsEl);
			}
		
			let buttonEl = document.createElement("button");
			buttonEl.setAttribute("id", tmdbId);
			buttonEl.setAttribute("onclick", "removeFav(this.id)");
			buttonEl.textContent = "Remove From Favourites";
			cardContentEl.appendChild(buttonEl);

			let buttonWatchEl = document.createElement("button");
			buttonWatchEl.setAttribute("id", tmdbId);
			buttonWatchEl.setAttribute("onclick", "favSaveWatch(this.id)");
			buttonWatchEl.textContent = "Add To Watchlist";
			cardContentEl.appendChild(buttonWatchEl);
	
			cardEl.appendChild(cardContentEl);
			favDisplayEl.appendChild(cardEl);

			whereToWatchEl.appendChild(iconHolder);
			cardContentEl.appendChild(whereToWatchEl);

			movies.favourites.push(
                {	title: movies.recentmovies[i].title, 
                    poster: movies.recentmovies[i].poster,
                    overview: movies.recentmovies[i].overview,
					servicegoogle: movies.recentmovies[i].servicegoogle,
					servicegoogleicon: movies.recentmovies[i].servicegoogleicon,
					servicegoogleurl: movies.recentmovies[i].servicegoogleurl,
					serviceamazon: movies.recentmovies[i].serviceamazon,
					serviceamazonicon: movies.recentmovies[i].serviceamazonicon,
					serviceamazonurl: movies.recentmovies[i].serviceamazonurl,
					serviceitunes: movies.recentmovies[i].serviceitunes,
					serviceitunesicon: movies.recentmovies[i].serviceitunesicon,
					serviceitunesurl: movies.recentmovies[i].serviceitunesurl,
					servicedisney: movies.recentmovies[i].servicedisney,
					servicedisneyicon: movies.recentmovies[i].servicedisneyicon,
					servicedisneyurl: movies.recentmovies[i].servicedisneyurl,
                    rating: movies.recentmovies[i].rating,
                    date: movies.recentmovies[i].date,
                    tmdbId: ""+movies.recentmovies[i].tmdbId+"" })

			//remove object from aray position [i]
			movies.recentmovies.splice(i, 1);
			//remove card from recentlist
			var deleteitem = document.getElementById("card-"+favId);
			deleteitem.remove();
	
			saveSearch();
		}
	}//end of for loop
}

// ADDING FROM RECENT TO WATCH LIST
var recentSaveWatch = function(clicked_id) {
	var saveId = document.getElementById(clicked_id).id;

	movies = JSON.parse(localStorage.getItem("movies"));

	for (var i = 0; i < movies.recentmovies.length; i++) {

		var recentId = ""+movies.recentmovies[i].tmdbId+"";
		console.log("save ID is: " +saveId);
		console.log("recent ID is: "+recentId);
		console.log("i final is: "+i);

		if (saveId === recentId) {
			let title = movies.recentmovies[i].title;
			let poster = movies.recentmovies[i].poster;
			let overview = movies.recentmovies[i].overview;
			let genres = movies.recentmovies[i].genres;
			let date = movies.recentmovies[i].date.substring(0, 4);
			let posterURL = "./assets/images/noPoster.png"
			if (poster) {
				posterURL="https://image.tmdb.org/t/p/w500"+poster;      
			}
			let tmdbId = movies.recentmovies[i].tmdbId;
			//let movieIdAttribute = movies.recentmovies[i].movieObject.tmdbId;
	
			// create card elements
			let cardEl = document.createElement("div");
			cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
			//cardEl.setAttribute("id", movieIdAttribute)
			cardEl.setAttribute("id", "watch-card-"+tmdbId)
	
	
			//add poster image
			let cardImageEl = document.createElement("div");
			cardImageEl.setAttribute("class", "card-image is-3");
			let figureEl = document.createElement("figure")
			figureEl.setAttribute("class", "image");
			let posterEl = document.createElement("img");
			posterEl.setAttribute("src", posterURL);
			posterEl.setAttribute("alt", "Poster " + title);
			//posterEl.setAttribute("class", "image");
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
			subtitleEl.textContent = genres;
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
			let whereToWatchIconEl;
	
			var indexId = movies.recentmovies[i].tmdbId;
	
			if (movies.recentmovies[i].serviceamazon === "Amazon Prime Video") {
				let watchID = movies.recentmovies[i].serviceamazon;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[i].serviceamazonurl+"' target='_blank'><img src='" + movies.recentmovies[i].serviceamazonicon + "' alt='" + movies.recentmovies[i].serviceamazon + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			}   
	
			if (movies.recentmovies[i].serviceitunes === "iTunes") {
				let watchID = movies.recentmovies[i].serviceitunes;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[i].serviceitunesurl+"' target='_blank'><img src='" + movies.recentmovies[i].serviceitunesicon + "' alt='" + movies.recentmovies[i].serviceitunes + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl); 
			}     
			
			if (movies.recentmovies[i].servicegoogle === "Google Play") {
				let watchID = movies.recentmovies[i].servicegoogle;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.recentmovies[i].servicegoogleurl+"' target='_blank'><img src='" + movies.recentmovies[i].servicegoogleicon + "' alt='" + movies.recentmovies[i].servicegoogle + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			} else {
			let whereToWatchNoOptionsEl = document.createElement("div");
			whereToWatchNoOptionsEl.innerHTML = movies.recentmovies[0];
			iconHolder.appendChild(whereToWatchNoOptionsEl);
			}

			let buttonEl = document.createElement("button");
			buttonEl.setAttribute("id", tmdbId);
			buttonEl.setAttribute("onclick", "watchSaveFav(this.id)");
			buttonEl.textContent = "Add To Favourites";
			cardContentEl.appendChild(buttonEl);

			let buttonWatchEl = document.createElement("button");
			buttonWatchEl.setAttribute("id", tmdbId);
			buttonWatchEl.setAttribute("onclick", "removeWatch(this.id)");
			buttonWatchEl.textContent = "Remove From Watchlist";
			cardContentEl.appendChild(buttonWatchEl);
	
			cardEl.appendChild(cardContentEl);
            watchlistDisplayEl.appendChild(cardEl);
			console.log("cardEl ----" + cardEl);
			
			whereToWatchEl.appendChild(iconHolder);
			cardContentEl.appendChild(whereToWatchEl);

			movies.watchlist.push(
                {	title: movies.recentmovies[i].title, 
                    poster: movies.recentmovies[i].poster,
                    overview: movies.recentmovies[i].overview,
					servicegoogle: movies.recentmovies[i].servicegoogle,
					servicegoogleicon: movies.recentmovies[i].servicegoogleicon,
					servicegoogleurl: movies.recentmovies[i].servicegoogleurl,
					serviceamazon: movies.recentmovies[i].serviceamazon,
					serviceamazonicon: movies.recentmovies[i].serviceamazonicon,
					serviceamazonurl: movies.recentmovies[i].serviceamazonurl,
					serviceitunes: movies.recentmovies[i].serviceitunes,
					serviceitunesicon: movies.recentmovies[i].serviceitunesicon,
					serviceitunesurl: movies.recentmovies[i].serviceitunesurl,
					servicedisney: movies.recentmovies[i].servicedisney,
					servicedisneyicon: movies.recentmovies[i].servicedisneyicon,
					servicedisneyurl: movies.recentmovies[i].servicedisneyurl,
                    rating: movies.recentmovies[i].rating,
                    date: movies.recentmovies[i].date,
                    tmdbId: ""+movies.recentmovies[i].tmdbId+"" })

			//remove object from aray position [i]
			movies.recentmovies.splice(i, 1);
			//remove card from recentlist
			var deleteitem = document.getElementById("card-"+saveId);
			deleteitem.remove();
			
			saveSearch();

			// loadWatchlist();

		}//end of if 
	}//end of for loop

}

//ADDING FROM FAVOURITES TO WATCHLIST
var favSaveWatch = function(clicked_id) {
	var favId = document.getElementById(clicked_id).id;

	movies = JSON.parse(localStorage.getItem("movies"));

	for (var i = 0; i < movies.favourites.length; i++) {

		var recentId = ""+movies.favourites[i].tmdbId+"";
		console.log("save ID is: " +favId);
		console.log("recent ID is: "+recentId);
		console.log("i final is: "+i);

		if (favId === recentId) {
			let title = movies.favourites[i].title;
			let poster = movies.favourites[i].poster;
			let overview = movies.favourites[i].overview;
			let genres = movies.favourites[i].genres;
			let date = movies.favourites[i].date.substring(0, 4);
			let posterURL = "./assets/images/noPoster.png"
			if (poster) {
				posterURL="https://image.tmdb.org/t/p/w500"+poster;      
			}
			let tmdbId = movies.favourites[i].tmdbId;
			//let movieIdAttribute = movies.recentmovies[i].movieObject.tmdbId;
	
			// create card elements
			let cardEl = document.createElement("div");
			cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
			//cardEl.setAttribute("id", movieIdAttribute)
			cardEl.setAttribute("id", "watch-card-"+tmdbId)
	
	
			//add poster image
			let cardImageEl = document.createElement("div");
			cardImageEl.setAttribute("class", "card-image is-3");
			let figureEl = document.createElement("figure")
			figureEl.setAttribute("class", "image");
			let posterEl = document.createElement("img");
			posterEl.setAttribute("src", posterURL);
			posterEl.setAttribute("alt", "Poster " + title);
			//posterEl.setAttribute("class", "image");
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
			subtitleEl.textContent = genres;
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
			let whereToWatchIconEl;
	
			var indexId = movies.favourites[i].tmdbId;
	
			if (movies.favourites[i].serviceamazon === "Amazon Prime Video") {
				let watchID = movies.favourites[i].serviceamazon;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.favourites[i].serviceamazonurl+"' target='_blank'><img src='" + movies.favourites[i].serviceamazonicon + "' alt='" + movies.favourites[i].serviceamazon + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			}   
	
			if (movies.favourites[i].serviceitunes === "iTunes") {
				let watchID = movies.favourites[i].serviceitunes;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.favourites[i].serviceitunesurl+"' target='_blank'><img src='" + movies.favourites[i].serviceitunesicon + "' alt='" + movies.favourites[i].serviceitunes + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl); 
			}     
			
			if (movies.favourites[i].servicegoogle === "Google Play") {
				let watchID = movies.favourites[i].servicegoogle;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.favourites[i].servicegoogleurl+"' target='_blank'><img src='" + movies.favourites[i].servicegoogleicon + "' alt='" + movies.favourites[i].servicegoogle + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			} else {
			let whereToWatchNoOptionsEl = document.createElement("div");
			whereToWatchNoOptionsEl.innerHTML = movies.watchlist[0];
			iconHolder.appendChild(whereToWatchNoOptionsEl);
			}

			let buttonEl = document.createElement("button");
			buttonEl.setAttribute("id", tmdbId);
			buttonEl.setAttribute("onclick", "watchSaveFav(this.id)");
			buttonEl.textContent = "Add To Favourites";
			cardContentEl.appendChild(buttonEl);

			let buttonWatchEl = document.createElement("button");
			buttonWatchEl.setAttribute("id", tmdbId);
			buttonWatchEl.setAttribute("onclick", "removeWatch(this.id)");
			buttonWatchEl.textContent = "Remove From Watchlist";
			cardContentEl.appendChild(buttonWatchEl);
	
			cardEl.appendChild(cardContentEl);
            watchlistDisplayEl.appendChild(cardEl);
			console.log("cardEl ----" + cardEl);
			
			whereToWatchEl.appendChild(iconHolder);
			cardContentEl.appendChild(whereToWatchEl);

			movies.watchlist.push(
                {	title: movies.favourites[i].title, 
                    poster: movies.favourites[i].poster,
                    overview: movies.favourites[i].overview,
					servicegoogle: movies.favourites[i].servicegoogle,
					servicegoogleicon: movies.favourites[i].servicegoogleicon,
					servicegoogleurl: movies.favourites[i].servicegoogleurl,
					serviceamazon: movies.favourites[i].serviceamazon,
					serviceamazonicon: movies.favourites[i].serviceamazonicon,
					serviceamazonurl: movies.favourites[i].serviceamazonurl,
					serviceitunes: movies.favourites[i].serviceitunes,
					serviceitunesicon: movies.favourites[i].serviceitunesicon,
					serviceitunesurl: movies.favourites[i].serviceitunesurl,
					servicedisney: movies.favourites[i].servicedisney,
					servicedisneyicon: movies.favourites[i].servicedisneyicon,
					servicedisneyurl: movies.favourites[i].servicedisneyurl,
                    rating: movies.favourites[i].rating,
                    date: movies.favourites[i].date,
                    tmdbId: ""+movies.favourites[i].tmdbId+"" })

			//remove object from aray position [i]
			movies.favourites.splice(i, 1);
			//remove card from recentlist
			var deleteitem = document.getElementById("fav-card-"+favId);
			deleteitem.remove();
			
			saveSearch();

			// loadWatchlist();

		}//end of if 
	}//end of for loop
}

//ADDING FROM WATCHLIST TO FAVOURITES
var watchSaveFav = function(clicked_id) {
	var saveId = document.getElementById(clicked_id).id;

	movies = JSON.parse(localStorage.getItem("movies"));

	for (var i = 0; i < movies.watchlist.length; i++) {

		var recentId = ""+movies.watchlist[i].tmdbId+"";
		console.log("save ID is: " +saveId);
		console.log("recent ID is: "+recentId);
		console.log("i final is: "+i);

		if (saveId === recentId) {
			let title = movies.watchlist[i].title;
			let poster = movies.watchlist[i].poster;
			let overview = movies.watchlist[i].overview;
			let genres = movies.watchlist[i].genres;
			let date = movies.watchlist[i].date.substring(0, 4);
			let posterURL = "./assets/images/noPoster.png"
			if (poster) {
				posterURL="https://image.tmdb.org/t/p/w500"+poster;      
			}
			let tmdbId = movies.watchlist[i].tmdbId;
			//let movieIdAttribute = movies.recentmovies[i].movieObject.tmdbId;
	
			// create card elements
			let cardEl = document.createElement("div");
			cardEl.setAttribute("class", "card is-child has-background-grey-dark hover has-text-white is-horizontal p-5 mb-5");
			//cardEl.setAttribute("id", movieIdAttribute)
			cardEl.setAttribute("id", "fav-card-"+tmdbId)
	
	
			//add poster image
			let cardImageEl = document.createElement("div");
			cardImageEl.setAttribute("class", "card-image is-3");
			let figureEl = document.createElement("figure")
			figureEl.setAttribute("class", "image");
			let posterEl = document.createElement("img");
			posterEl.setAttribute("src", posterURL);
			posterEl.setAttribute("alt", "Poster " + title);
			//posterEl.setAttribute("class", "image");
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
			subtitleEl.textContent = genres;
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
			let whereToWatchIconEl;
	
			var indexId = movies.watchlist[i].tmdbId;
	
			if (movies.watchlist[i].serviceamazon === "Amazon Prime Video") {
				let watchID = movies.watchlist[i].serviceamazon;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.watchlist[i].serviceamazonurl+"' target='_blank'><img src='" + movies.watchlists[i].serviceamazonicon + "' alt='" + movies.watchlist[i].serviceamazon + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			}   
	
			if (movies.watchlist[i].serviceitunes === "iTunes") {
				let watchID = movies.watchlist[i].serviceitunes;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.watchlist[i].serviceitunesurl+"' target='_blank'><img src='" + movies.watchlist[i].serviceitunesicon + "' alt='" + movies.watchlist[i].serviceitunes + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl); 
			}     
			
			if (movies.watchlist[i].servicegoogle === "Google Play") {
				let watchID = movies.watchlist[i].servicegoogle;
				whereToWatchIconEl = document.createElement("div");
				watchID = watchID.replace(/\s+/g, '-').toLowerCase();
				whereToWatchIconEl.setAttribute("id", watchID+"-"+indexId);
				whereToWatchIconEl.setAttribute("class", "p-3 has-background-white");
				whereToWatchIconEl.innerHTML= "<a href='"+movies.watchlist[i].servicegoogleurl+"' target='_blank'><img src='" + movies.watchlist[i].servicegoogleicon + "' alt='" + movies.watchlist[i].servicegoogle + "' /></a>";
				iconHolder.appendChild(whereToWatchIconEl);
			} else {
			let whereToWatchNoOptionsEl = document.createElement("div");
			whereToWatchNoOptionsEl.innerHTML = movies.watchlist[0];
			iconHolder.appendChild(whereToWatchNoOptionsEl);
			}

			let buttonEl = document.createElement("button");
			buttonEl.setAttribute("id", tmdbId);
			buttonEl.setAttribute("onclick", "favSaveWatch(this.id)");
			buttonEl.textContent = "Add To Watchlist";
			cardContentEl.appendChild(buttonEl);

			let buttonWatchEl = document.createElement("button");
			buttonWatchEl.setAttribute("id", tmdbId);
			buttonWatchEl.setAttribute("onclick", "removeFav(this.id)");
			buttonWatchEl.textContent = "Remove From Favourites";
			cardContentEl.appendChild(buttonWatchEl);
	
			cardEl.appendChild(cardContentEl);
            favDisplayEl.appendChild(cardEl);
			console.log("cardEl ----" + cardEl);
			
			whereToWatchEl.appendChild(iconHolder);
			cardContentEl.appendChild(whereToWatchEl);

			movies.favourites.push(
                {	title: movies.watchlist[i].title, 
                    poster: movies.watchlist[i].poster,
                    overview: movies.watchlist[i].overview,
					servicegoogle: movies.watchlist[i].servicegoogle,
					servicegoogleicon: movies.watchlist[i].servicegoogleicon,
					servicegoogleurl: movies.watchlist[i].servicegoogleurl,
					serviceamazon: movies.watchlist[i].serviceamazon,
					serviceamazonicon: movies.watchlist[i].serviceamazonicon,
					serviceamazonurl: movies.watchlist[i].serviceamazonurl,
					serviceitunes: movies.watchlist[i].serviceitunes,
					serviceitunesicon: movies.watchlist[i].serviceitunesicon,
					serviceitunesurl: movies.watchlist[i].serviceitunesurl,
					servicedisney: movies.watchlist[i].servicedisney,
					servicedisneyicon: movies.watchlist[i].servicedisneyicon,
					servicedisneyurl: movies.watchlist[i].servicedisneyurl,
                    rating: movies.watchlist[i].rating,
                    date: movies.watchlist[i].date,
                    tmdbId: ""+movies.watchlist[i].tmdbId+"" })

			//remove object from aray position [i]
			movies.watchlist.splice(i, 1);
			//remove card from recentlist
			var deleteitem = document.getElementById("watch-card-"+saveId);
			deleteitem.remove();
			
			saveSearch();

			// loadWatchlist();

		}//end of if 
	}//end of for loop

}

/* CAN BE DELETED
var checkExistingFav = function(currentId) {

// 	var test = currentId;
// 	console.log("display i: " + i)
// 	console.log(currentId);
// 	movies = JSON.parse(localStorage.getItem("movies"));

// 	for (var x = 0; x < movies.favourites.length; x++) {
	
// 	console.log("display x: " + x);
	
// 	if (currentId === movies.favourites[x].tmdbId) {

// 	alert("DUPLICATE IS ARRAY #: " + x);
// 	console.log("DUPLICATE IS ARRAY #: " + x);

// 	var removeItem = movies.favourites.map(function(item) {return item.tmdbId;}).indexOf(currentId);
// 	movies.favourites.splice(removeItem, 1)
// 	var deleteitem = document.getElementById("fav-card-"+currentId);
// 	deleteitem.remove();


// 	saveSearch();


// 	} else {alert("DISPLAY"); displayFav(test)};
// 	}
}

var checkExistingWatchlist = function(watchlistId) {

// 	for (var b = 0; 0 < movies.watchlist.length; b++) {
// 		var recentExisting = watchlistId;

// 		var watchlistExisting = ""+movies.watchlist[b].tmdbId+"";

// 		// var watchlistExisting = movies.watchlist[j].tmdbId;

// 		if (recentExisting === watchlistExisting) {alert("Already in Watchlist"); removeWatch(); break;}
// 		}
}*/

// REMOVE FROM FAVOURITES LIST
var removeFav = function(this_id) {

	movies = JSON.parse(localStorage.getItem("movies"));

	var removeItem = movies.favourites.map(function(item) {return item.tdmbId;}).indexOf(this_id);

	movies.favourites.splice(removeItem, 1)

	var deleteitem = document.getElementById("fav-card-"+this_id);
	deleteitem.remove();

	saveSearch();
	
}

// REMOVE FROM WATCHLIST
var removeWatch = function(this_id) {


	movies = JSON.parse(localStorage.getItem("movies"));

	var removeItem = movies.watchlist.map(function(item) {return item.tdmbId;}).indexOf(this_id);

	movies.watchlist.splice(removeItem, 1)

	var deleteitem = document.getElementById("watch-card-"+this_id);
	deleteitem.remove();
	
	saveSearch();

}

// END OF WATCHLIST AND FAVOURITES LIST 

loadGenres();
loadMovies();
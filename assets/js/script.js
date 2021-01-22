var genreAreaEl = document.getElementById("genres-list");

function loadGenres() {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=fdf647e2a6c6b5d7ea2edb2acfe6abf1&language=en-US")
    .then(function(response){
        return response.json();        
    })
    .then(function(data){
        for (var i = 0; i < data.genres.length; i++) {
            let genreItemHolderEl = document.createElement("div");
            genreItemHolderEl.setAttribute("class", "ck-button");
            let genreItemLabelEl = document.createElement("label");

            let genreItemEl = document.createElement("input");
            genreItemEl.setAttribute("type", "checkbox");
            genreItemEl.setAttribute("value", data.genres[i].id)
            genreItemEl.setAttribute("id", data.genres[i].id);
            let genreItemTextEl = document.createElement("span");
            genreItemTextEl.textContent = data.genres[i].name;
            genreItemLabelEl.appendChild(genreItemEl);
            genreItemLabelEl.appendChild(genreItemTextEl);

            genreItemHolderEl.appendChild(genreItemLabelEl);
            genreAreaEl.appendChild(genreItemHolderEl); 
            
        }
    })
}

loadGenres();

/*<div id="ck-button">
   <label>
      <input type="checkbox" value="1"><span>red</span>
   </label>
</div>*/
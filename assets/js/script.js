var apiUrl= function(){ 
fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="
+"Family guy", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2bbe3f6662msh6816e85f5b1dd27p1e0fe8jsncb2c41fb7a72",
		"x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
	}
})

.then(response => {
    return response.json();
	console.log(response);
})
.catch(err => {
	console.error(err);
});

}
console.log(apiUrl);
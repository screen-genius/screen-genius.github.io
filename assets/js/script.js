



function getAPI (movieTitle) {
	fetch(
	'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=' +
	movieTitle, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2bbe3f6662msh6816e85f5b1dd27p1e0fe8jsncb2c41fb7a72",
		"x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
	}
})

.then(function(response) {
    return response.json();
	
})
.catch(err => {
	console.error(err);
})

.then (function(response) {
	console.log(response);
	var dataEl = document.querySelectorAll("");
	var availableAt="";
	var resultName ="";
	var resultPicture="";
	for (i = 0; i < dataEl.length; i++) {
	resultName = response.results[i].name;
	resultPicture = response.results[i].picture;
	availableAt = response.results[i].locations[0].display_name;
	console.log(availableAt);
	console.log(resultPicture);
	console.log(resultName);
}
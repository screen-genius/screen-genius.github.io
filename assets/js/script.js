console.log("i work");

let searchNAme ="James";
let secondSearchName = "Bond";

fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=James%20Bond", {
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
    displayData(data);
})
.catch(err => {
	console.error(err);
	
})

function displayData(data){
    console.log("i work 2");
    console.log(data);
}
/*var apiUrl ='https://api.openweathermap.org/data/2.5/weather?q='+usrChnCity+'&units=imperial&APPID=a812584800c73c0eb9e12320bd5b45ea';
    fetch(apiUrl)
        .then(function(response) {   //callback function
        return response.json(); //response converted to json
        })
        .then(function(data) {  //
        displayCrntWeather(data);
        });*/
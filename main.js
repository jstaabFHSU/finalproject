import { WEATHER_API_KEY } from './apikey.js';

let defaultLocation;

//accepts parameter of a location
//returns the API URL with that location
const weatherURL = (location) => {
    //WEATHER_API_KEY is a function that returns my API key
    let key = WEATHER_API_KEY();
    return "http://api.openweathermap.org/data/2.5/weather?q=" +
                     location + "&units=imperial&appid=" + key;
}

//checks if user has set a default location manually
//if so, sets defaultLocation to that location, otherwise, defaults to Lawrence, Kansas
function locationCheck() {
    if(localStorage.getItem("userSetLocation")) {
        defaultLocation = JSON.parse(localStorage.getItem("userSetLocation"));
    } else {
        defaultLocation = "Lawrence, Kansas";
    }
    const locationButton = document.getElementById("locale");
    locationButton.addEventListener("click", (event) => {
    defaultLocation = document.getElementById("searchedLocation").value;
    getWeather();
}, false);
console.log(defaultLocation);
}
locationCheck();

//sets default location in local storage when user clicks setlocation button
const setLocationButton = document.getElementById("setlocation");
setLocationButton.addEventListener("click", (event) => {
    localStorage.setItem("userSetLocation", JSON.stringify(defaultLocation));
})

//retrieves weather API data and inputs object property values into HTML
const getWeather = async () => {
    const data = await fetch(weatherURL(defaultLocation));
    const weatherData = await data.json();
    console.log(weatherData);
    let conditions = weatherData.weather[0].main;
    let temp = weatherData.main.temp;
    let wind = weatherData.wind.speed;
    let humidity = weatherData.main.humidity;
    let visibility = (weatherData.visibility / 1000);
    document.getElementById('conditions').innerHTML = conditions;
    document.getElementById('temp').innerHTML = temp;
    document.getElementById('wind').innerHTML = wind;
    document.getElementById('humidity').innerHTML = humidity;
    document.getElementById('visibility').innerHTML = visibility;
    document.getElementById('shownlocation').innerHTML = defaultLocation;
}
getWeather();

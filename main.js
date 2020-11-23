import { windConversion, capitalizeLocation } from './format_funcs.js';

let defaultLocation;
let key = "e6829fea390bfd66e1381953b9327c55"; //openweathermap.org API key

const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function getDay(offset = 0) {
    return week[(new Date().getDay() + offset) % week.length]
}

let autoLocation;

const locationButton = document.getElementById("search");
    locationButton.addEventListener("click", (event) => {
    defaultLocation = document.getElementById("searchedLocation").value;
    getWeather(); //if search button clicked, getWeather needs to be called here
}, false);

//sets default location in local storage when user clicks setlocation button
const setLocationButton = document.getElementById("setlocation");
    setLocationButton.addEventListener("click", (event) => {
    localStorage.setItem("userSetLocation", JSON.stringify(defaultLocation));
})

function showLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

navigator.geolocation.getCurrentPosition((position) => {
    getURL(position.coords.latitude, position.coords.longitude);
  });

  function errorHandler(err) {
      if(err.code == 1) {
        alert("Access is denied");
      } else if(err.code == 2) {
        alert("Position Unavailable");
      }
  }

const getURL = async (lat, lon) => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, errorHandler);
    }
    
    //uses geolocation for lat/lon, then calls API to get city name for those coords
    const APILocationURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat +
    "&lon=" + lon + "&appid=" + key;
    const APIData = await fetch(APILocationURL);
    const APIDataParsed = await APIData.json();
    autoLocation = APIDataParsed.name;
    //localStorage.setItem("geoLocale", JSON.stringify(APIDataParsed.name));

    //accepts parameter of a location; returns the API URL with that location
    const weatherURL = (location) => {
        return "https://api.openweathermap.org/data/2.5/weather?q=" +
                        location + "&units=imperial&appid=" + key;
    }

    //accepts parameter of API icon code; returns API URL for that icon code
    const iconURL = (code) => {
        return "https://openweathermap.org/img/wn/" + String(code) + "@2x.png";
    }

    //accepts lat and long coords, returns API URL for daily weather at that location
    const dailyURL = (lat, lon) => {
        return "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                lat + "&lon=" + lon + "&exclude=currently,minutely,alerts" +
                "&units=imperial&appid=" + key;
    }

    //assigns to defaultLocation the city data to be displayed on page.
    //first checks localStorage for user-assigned default location;
    //then checks localStorage for geo-located location;
    //else uses "Lawrence, Kansas" as default.
    //otherwise uses what has just been searched for
    const assignLocation = () => {
        if(localStorage.getItem("userSetLocation")) {
            defaultLocation = JSON.parse(localStorage.getItem("userSetLocation"));
        } else if(autoLocation) {
            defaultLocation = autoLocation;
        } else {
            defaultLocation = "Lawrence, Kansas";
        }
    }
    assignLocation();




    //fetches weather API data and inputs object property values into HTML
    const getWeather = async () => {
        //today
        const data = await fetch(weatherURL(defaultLocation));
        const weatherData = await data.json();

        //five-day
        const daily = await fetch(dailyURL(weatherData.coord.lat, weatherData.coord.lon));
        const dailyData = await daily.json();
        console.log(daily);

        //today
        let icon = iconURL(weatherData.weather[0].icon);
        let feelslike = (weatherData.main.feels_like);
        let conditions = weatherData.weather[0].main;
        let temp = weatherData.main.temp;
        let todayhigh = weatherData.main.temp_max;
        let todaylow = weatherData.main.temp_min;
        let wind = weatherData.wind.speed;
        let direction = weatherData.wind.deg;
        let humidity = weatherData.main.humidity;
        let pressure = (weatherData.main.pressure / 33.86);
        document.getElementById('icon').src = icon;
        document.getElementById('feelslike').innerHTML = Math.round(feelslike) + "°";
        document.getElementById('conditions').innerHTML = conditions;
        document.getElementById('temp').innerHTML = Math.round(temp) + "°";
        document.getElementById('todayhigh').innerHTML = Math.round(todayhigh) + "°";
        document.getElementById('todaylow').innerHTML = Math.round(todaylow) + "°";
        document.getElementById('wind').innerHTML = Math.round(wind);
        document.getElementById('direction').innerHTML = windConversion(direction);
        document.getElementById('humidity').innerHTML = humidity + "%";
        document.getElementById('pressure').innerHTML = pressure.toFixed(2);
        document.getElementById('shownlocation').innerHTML = capitalizeLocation(defaultLocation);

        //five-day
        [1, 2, 3, 4, 5].forEach(day => {
            document.getElementById(`icon${day}`).src = iconURL(dailyData.daily[day].weather[0].icon);
            document.getElementById(`sky${day}`).innerHTML = dailyData.daily[day].weather[0].main;
    
            document.getElementById(`day${day}`).innerHTML = getDay(day - 1);
    
            const high = Math.round(dailyData.daily[day].temp.max);
            document.getElementById(`high${day}`).innerHTML = `${high}°`;
    
            const low = Math.round(dailyData.daily[day].temp.min);
            document.getElementById(`low${day}`).innerHTML = `${low}°`;
        })
    }
    getWeather();
}


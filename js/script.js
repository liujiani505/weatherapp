

let weatherData;
let forecastData;
const API_KEY="25f0bf1c5b6fc57bf8d61c0630ea40b5";
const WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?";
const FORECAST_URL = "http://api.openweathermap.org/data/2.5/onecall?";
const $name = $("#city-name")
const $temp = $("#temp")
const $desc = $("#desc")
const $humidity = $("#humidity")
const $wind = $("#wind")
const $icon = $(".icon")
const $weather = $(".weather")
const $input = $("input[type='text']");


//convert temperature data in Kelvin to Fahrenheit
function convertTemp(temp){
    let fahrenheit = Math.floor((temp - 273.15) * 9/5 + 32);
    return fahrenheit;
}

//converts UNIX timestamps to a readable format
function convertTime(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = a.getMonth()+1;
    let date = a.getDate();
    let time = month + '/' + date+ '/' + year;
    return time;
  };


//handle current weather data
function handleWeatherData() {   
    $.ajax(`${WEATHER_URL}q=${$input.val()}&appid=${API_KEY}`)
    .then(function(data){ 
        weatherData = data        
        $name.text(`${weatherData.name}`)
        $temp.text(`${convertTemp(weatherData.main.temp)} °F`)
        $desc.text(`${weatherData.weather[0].description}`)
        $humidity.text(`Humidity: ${weatherData.main.humidity} %`)
        $wind.text(`Wind speed: ${weatherData.wind.speed} km/h`)
        $icon.attr("src", `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`)
        $weather.removeClass("loading")
        $input.val(" ") 
        $('body').css('background-image', "url('https://source.unsplash.com/1600x900/?" + weatherData.name + "')");
        // use the lat & lon values returned from the weather API to call the second onecall API
        handleForecastData(weatherData.coord.lat, weatherData.coord.lon);
    }, function(error){
        console.log(error)
    })   
}

// handle 5 day forecast data
function handleForecastData(lat, lon) {   
    
        $.ajax(`${FORECAST_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(function(data){
            forecastData = data
            for(let i = 1; i<6; i++){
                $("#date-day"+i).text(`${convertTime(forecastData.daily[i].dt)}`)
                $("#temperature-day"+i).text(`${convertTemp(forecastData.daily[i].temp.day)} °F`)
                $("#icon-day"+i).attr("src", `http://openweathermap.org/img/wn/${forecastData.daily[i].weather[0].icon}@2x.png`)
                $("#description-day"+i).text(`${forecastData.daily[i].weather[0].description}`)
                
            }
        }, function(error){
            console.log(error)
        })
    
}

$("form").on("submit", function(event){
    event.preventDefault();
    handleWeatherData();
    handleForecastData();
})









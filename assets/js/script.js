const searchText = document.getElementById("search-text");
const searchBtn = document.getElementById("search-btn");
const clearHistory = document.getElementById("clr-history");
const displayCity = document.getElementById("display-city");
const icon = document.getElementById("icon");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const uvEl = document.getElementById("UV-index");
const history = document.getElementById("history");
var forecastFive = document.getElementById("fiveday-header");
var currentWeather = document.getElementById("today-weather");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const APIKey = "4e3aee51a2cf789ce2e18e5b2708edfa";

function startApp() {
function getWeather(cityName) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;
    fetch(queryURL)
        .then(function (response) {
            response.json().then(function (data) {
            currentWeather.classList.remove("d-none");

            const currentDate = new Date(data.dt * 1000);
            displayCity.innerHTML = data.name + " (" + (currentDate.getMonth()+1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear() + ") ";
            displayCity.setAttribute("class", "font-weight-bold");

            let currentIcon = data.weather[0].icon;
            icon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
            icon.setAttribute("alt", data.weather[0].description);

            temp.innerHTML = "<b>Temperature: </b>" + Math.round(data.main.temp) + " &#176F";
            humidity.innerHTML = "<b>Humidity: </b>" + data.main.humidity + "%";
            wind.innerHTML = "<b>Wind Speed: </b>" + data.wind.speed + " MPH";
            
            let fetchUV = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&units=imperial&appid=" + APIKey + "&cnt=1";
            fetch(fetchUV)
                .then(function (response) {
                    response.json().then(function (data) {

                        uvEl.innerHTML = "<b>UV Index: </b>"
                        let UVIndex = document.createElement("span");
                        UVIndex.innerHTML =  + Math.floor(data[0].value);
                        uvEl.append(UVIndex);
                        
                        //uv index color
                        if (data[0].value < 3 ) {
                            UVIndex.setAttribute("class", "badge  badge-pill badge-success");
                        }
                        else if (data[0].value < 6) {
                            UVIndex.setAttribute("class", "badge badge-pill badge-warning badge-lighten-1");
                        }
                        else if (data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge badge-pill badge-warning badge-darken-3");
                        }
                        else if (data[0].value < 11) {
                            UVIndex.setAttribute("class", "badge badge-pill badge-danger badge-lighten-1");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-pill badge-danger badge-darken-3");
                        }
                });
            
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + data.id + "&units=imperial&appid=" + APIKey;
            fetch(forecastQueryURL)
                .then(function (response) {
                    response.json().then(function (data) {
                    forecastFive.classList.remove("d-none");
                    
                    const forecastCards = document.querySelectorAll(".forecast");
                    for (i = 0; i < forecastCards.length; i++) {

                        //date info
                        forecastCards[i].innerHTML = "";
                        const index = i * 8 + 4;
                        const setDate = new Date(data.list[index].dt * 1000);
                        const setDateEl = document.createElement("p");
                        setDateEl.setAttribute("class", "mt-3 mb-0 forecast-date font-weight-bold text-dark");
                        setDateEl.innerHTML = (setDate.getMonth() + 1) + "/" + setDate.getDate() + "/" + setDate.getFullYear();
                        forecastCards[i].append(setDateEl);

                        //image (sun, rain, cloud, etc)
                        const forecastImgs = document.createElement("img");
                        forecastImgs.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[index].weather[0].icon + "@2x.png");
                        forecastImgs.setAttribute("alt", data.list[index].weather[0].description);
                        forecastCards[i].append(forecastImgs);
                        
                        //temp element
                        const forecastTemps = document.createElement("p");
                        forecastTemps.innerHTML = "<b> Temp:</b> " + Math.round(data.list[index].main.temp) + " &#176F";
                        forecastCards[i].append(forecastTemps);

                        //wind element
                        const forecastWinds = document.createElement("p");
                        forecastWinds.innerHTML = "<b>Wind Speed:</b> " + "<br>" + data.list[index].wind.speed + " MPH";
                        forecastCards[i].append(forecastWinds);

                        //humidity element
                        const forecastHumiditys = document.createElement("p");
                        forecastHumiditys.innerHTML = "<b>Humidity:</b> " + data.list[index].main.humidity + "%";
                        forecastCards[i].append(forecastHumiditys);
                    }
                })
            });
        });
    });
});
}
//search features
searchBtn.addEventListener("click", function () {
    
    const searchTerm = searchText.value;

    getWeather(searchTerm);

    //saves search history in local storage
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    showHistory();
    clearSearchBar();
})

//learned new feature, enter works instead of just clicking the search icon
searchText.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
    const searchTerm = searchText.value;

    getWeather(searchTerm);

    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    showHistory();
    clearSearchBar();
    }
})

//clear history feature, help avoid clutter on the page
clearHistory.addEventListener("click", function () {
    
    localStorage.clear();
    searchHistory = [];
    showHistory();
})

function showHistory() {
    history.innerHTML = "";
    
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block m-1 bg-secondary text-white text-capitalize text-center");
        historyItem.setAttribute("value", searchHistory[i]);

        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        })
        history.append(historyItem);
    }
}

showHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}

var clearSearchBar = () => {
    searchText.value= "";
}
}

startApp();
const myAPIKey = "f7f892d9d77561663b2b4d372eb3311d";
var submitButtonEl = document.getElementById("sbm-btn");
var saveCityEl = document.querySelector(".save-city");

// hold local storage of city
var cityArr = [];

var retrieveData = function (city) {
    // get weather in imperial unit
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myAPIKey + "&units=imperial";

    // fetch api and city data
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                
                // this has uv info
                var url2 = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + myAPIKey + "&units=imperial";
                fetch(url2).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            // call display today function to insert today's data
                            displayToday(data, city);
                        })
                    }
                    else {
                        alert("Error: City Not Found");
                    }
                }).catch(function (error) {
                    alert("Unable to connect to Open Weather")
                })
                
                // forecast info
                var url3 = "https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + myAPIKey + "&units=imperial";
                fetch(url3).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            // call function to display forecast
                            displayForecast(data, city);
                        })
                    }
                    else {
                        alert("Error: City Not Found");
                    }
                }).catch(function (error) {
                    alert("Unable to connect to Open Weather")
                })
            })
        }
        else {
            alert("Error: City Not Found");
        }
    })
    .catch(function (error) {
        alert("Unable to connect to Open Weather");
    });
};

var displayForecast = function (data, city) {
	var headerEl = document.querySelector("h3");
	headerEl.innerHTML = "<strong>5-Day Forecast:</strong>";

	// select all elements with class future-day
    var forecastEl = $(".future-day");
    forecastEl.children("p").remove();


	// loop through first five days of forecast
	// add each day forecast to page
    for (var i = 0; i < forecastEl.length; i++) {
        // extract info for 5 days in future 
		var date = moment(data.list[i].date_text)
			.add(i + 1, "days")
			.format("MM" + "/" + "DD" + "/" + "YYYY");
		var humidity = "Humidity: " + data.list[i].main.humidity + " %";
		var temp = "Temp: " + data.list[i].main.temp + "°F";
		var wind = "Wind: " + data.list[i].wind.speed + " MPH";
        var icon = data.list[i].weather[0].icon;
        
        // create elements for each data value and append to card element on page
        var dateEl = document.createElement("h6");
        dateEl.classList = "card-title";
		dateEl.textContent = date;
		forecastEl[i].appendChild(dateEl);

        // icon append
        var iconEl = document.createElement("p");
        iconEl.classList = "card-text";
		iconEl.innerHTML =
			"<img src='http://openweathermap.org/img/wn/" + icon + ".png'/>";
		forecastEl[i].appendChild(iconEl);

        // temp append
        var tempEl = document.createElement("p");
		tempEl.classList = "card-text";
		tempEl.textContent = temp;
		forecastEl[i].appendChild(tempEl);

        // wind append
		var windEl = document.createElement("p");
        windEl.textContent = wind;
        windEl.classList = "card-text";
        forecastEl[i].appendChild(windEl);
        
        // humidity append
		var humidityEl = document.createElement("p");
        humidityEl.textContent = humidity;
        humidityEl.style.paddingBottom = "1vh";
        humidityEl.classList = "card-text";
		forecastEl[i].appendChild(humidityEl);
	}
}

var displayToday = function (data, city) {
    // removes current display to make room for new city call
    headerRemove();
    dayTempRemove();

    saveCity(city);

    // parses data into page, define variables first 
    var temp = data.current.temp;
    var date = moment(data.current.date_text).format("MM" + "/" + "DD" + "/" + "YYYY");
    var city = city;
    var wind = data.current.wind_speed;
    var icon = data.current.weather[0].icon;
    var humidity = data.current.humidity;
    var uvi = data.current.uvi;

    // append the city header
    headerAppend(date, city, icon);
    
    // append those days temp values
    dayTempAppend(temp, wind, humidity, uvi);
}

var headerRemove = function () {
	$(".cityHeader").remove();
};

var headerAppend = function (date, city, icon) {
    // sets border for parent row element
    var rowDivEl = document.querySelector(".today-weather");
    rowDivEl.style.opacity = "1";

    // select col-header element 
    var divColHeaderEl = document.querySelector(".col-header");

    // create h2 element
    var headerEl = document.createElement("h2");
    headerEl.classList = "cityHeader text-capitalize";
    headerEl.textContent = city + " (" + date + ") ";
    headerEl.innerHTML =
			"<strong>" +
			headerEl.textContent +
			"<img src='http://openweathermap.org/img/wn/" + icon + ".png'/></strong>";
    
    // append header to page
    divColHeaderEl.appendChild(headerEl);
}

var dayTempRemove = function () {
	$(".list-group").remove();
};

var dayTempAppend = function (temp, wind, humidity, uvi) {
    // select parent element
    var tempValsEl = document.querySelector(".col-temp-vals");

    // create list element
    var listEl = document.createElement("ul");
    listEl.classList = "list-group";
    
    // create array to loop over
    var dataList = [temp, wind, humidity, uvi];

    //loop through all data and insert as list-item
    for (var i = 0; i < dataList.length; i++) {
        var itemListEl = document.createElement("li");
        itemListEl.classList = "list-group-item";
        if (i === 0) {
            itemListEl.textContent = "Temp: " + dataList[i] + "°F";
        } else if (i === 1) {
            itemListEl.textContent = "Wind: " + dataList[i] + " MPH";
        } else if (i === 2) {
            itemListEl.textContent = "Humidity: " + dataList[i] + " %";
        } else {
            if (parseInt(dataList[i]) <= 2) {
                itemListEl.innerHTML =
                    "UV Index:<button class='btn green'>" +
                    uvi +
                    "</button>";
            }
            else if (parseInt(dataList[i]) <= 5) {
                itemListEl.innerHTML = "UV Index:<button class='btn yellow'>" + uvi + "</button>";
            }
            else if (parseInt(dataList[i]) <= 7) {
                itemListEl.innerHTML = "UV Index:<button class='btn orange'>" + uvi + "</button>";
            }
            else if (7.0 < parseInt(dataList[i])) {
                itemListEl.innerHTML = "UV Index:<button class='btn red'>" + uvi + "</button>";
            }
        }
        
        listEl.appendChild(itemListEl);
    }
    // append list element to page
    tempValsEl.appendChild(listEl);
};

var historyButtons = function (city) {
	// add current city to storage and insert in page
	var cityButtonEl = document.createElement("button");
	cityButtonEl.setAttribute("type", "submit");
	cityButtonEl.classList = "btn btn-secondary text-capitalize";
	cityButtonEl.textContent = city;

	// append to page
	saveCityEl.appendChild(cityButtonEl);
}

var saveCity = function (city) {
    if (cityArr.indexOf(city) === -1) {
        cityArr.push(city);
        
        // save city to page 
        historyButtons(city);
	}

    localStorage.setItem("city", cityArr);
};

var loadCities = function () {
    // retrieve city
    cityArr = localStorage.getItem("city");
    cityArr = cityArr.split(",");

    // setup history buttons
    for (var i = 0; i < cityArr.length; i++) {
        historyButtons(cityArr[i]);
    }    
}

var getCityForecast = function (event) {
    var city = $(this).siblings(".form-control").val().trim();

    // calls for forecast information
    getForecast(city);
}

var getCity = function (event) {

    // retrieves text input from user and inserts into variable city
    var city = $(this).siblings(".form-control").val().trim();

    // calls api to retrieve city data
    retrieveData(city);
};


loadCities();
submitButtonEl.addEventListener("click", getCity);
$(".save-city").on("click", ".btn-secondary", function (event) {
    var city = event.target.textContent;

    retrieveData(city);
})


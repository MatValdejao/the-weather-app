const myAPIKey = "f7f892d9d77561663b2b4d372eb3311d";
var submitButtonEl = document.getElementById("sbm-btn");

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

var displayToday = function (data, city) {
    saveCity(city);

    // parses data into page, define variables first 
    console.log(data)
    var temp = data.current.temp;
    date = moment().format("MM" + "/" + "DD" + "/" + "YYYY");
    var city = city;
    var wind = data.current.wind_speed;
    var icon = data.current.weather[0].icon;
    var humidity = data.current.humidity;
    var uvi = data.current.uvi;

    // sets border for parent row element
    var rowDivEl = document.querySelector(".today-weather");
    rowDivEl.classList = "border border-dark";

    // append the city header
    headerAppend(date, city, icon);
    
    // append those days temp values
    dayTempAppend(temp, wind, humidity, uvi);
}

var headerAppend = function (date, city, icon) {
    // select col-header element 
    var divColHeaderEl = document.querySelector(".col-header");

    // create h2 element
    var headerEl = document.createElement("h2");
    headerEl.classList = "cityHeader text-capitalize";
    headerEl.textContent = city + " (" + date + ") ";
    headerEl.innerHTML =
			"<strong>" +
			headerEl.textContent +
			"<img src='http://openweathermap.org/img/wn/" + icon + ".png'</strong>";
    
    // append header to page
    divColHeaderEl.appendChild(headerEl);
}

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
            console.log(dataList[i]);
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
}

var saveCity = function (city) {
    localStorage.setItem("city", city);
}

var getCity = function (event) {
    // retrieves text input from user and inserts into variable city
    var city = $(this).siblings(".form-control").val().trim()

    // calls api to retrieve city data
    retrieveData(city);
}


submitButtonEl.addEventListener("click", getCity);



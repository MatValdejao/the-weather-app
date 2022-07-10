const myAPIKey = "f7f892d9d77561663b2b4d372eb3311d";
var submitButtonEl = document.getElementById("sbm-btn");

var retrieveData = function (city) {
    var apiURL = "https:api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myAPIKey;

    // fetch api and city data
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // call display city to insert to page
                displayCity(city, data);
            })
        }
        else {
            alert("Error: City Not Found")
        }
    })
    .catch(function (error) {
        alert("Unable to connect to Open Weather");
    });
};


var getCity = function (event) {
    // retrieves text input from user and inserts into variable city
    var city = $(this).siblings(".form-control").val().trim()

    // calls api to retrieve city data
    retrieveData(city);
}


submitButtonEl.addEventListener("click", getCity);



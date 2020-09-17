
var apiKey = "cc6475a579b89b1bda38866e3fd95407"
var cityResp = ""
var searchHistory = $("#search-history")
var lat = 0;
var lon = 0;
var queryCurrentURL;
var queryUvURL;
var forecastURL;
var city;
var cityInput;
var currentTime = moment().format("DD/MM/YYYY")


// search click event
$("#find-city").on("click", function (event) {
    event.preventDefault();
    city = $("#city-input");
    cityInput = city.val();

    weatherData();
})


function weatherData() {

    queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + apiKey;
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + apiKey;

    // fetch current weather data
    $.ajax({
        url: queryCurrentURL,
        method: "GET"
    }).then(function (currentResp) {
        console.log(currentResp)

        var degreeCel = currentResp.main.temp - 273.15
        degreeCel = degreeCel.toFixed(1)

        cityResp = currentResp.name + ", " + currentResp.sys.country

        $(".card-title").text(cityResp + " (" + currentTime + ")");
        $("#temperature").text(degreeCel + "°C");
        $("#humidity").text(currentResp.main.humidity + "%");
        $("#wind-speed").text(currentResp.wind.speed + " MPH");
        lat = currentResp.coord.lat;
        lon = currentResp.coord.lon;

        var icon = currentResp.weather[0].icon
        var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        $("img").attr("src", iconURL)

        //fetch uv data
        queryUvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

        $.ajax({
            url: queryUvURL,
            method: "GET"
        }).then(function (uvResp) {
            console.log(uvResp)

            $("#uv-index").text(uvResp.value);

            if (uvResp.value < 3) {
                $("#uv-index").css("background-color", "rgb(13, 214, 13)")
                $("#uv-index").css("color", "black")
            } else if (uvResp.value < 6) {
                $("#uv-index").css("background-color", "rgb(255, 255, 17)")
                $("#uv-index").css("color", "black")
            } else if (uvResp.value < 8) {
                $("#uv-index").css("background-color", "orange")
                $("#uv-index").css("color", "black")
            } else if (uvResp.value < 11) {
                $("#uv-index").css("background-color", "red")
                $("#uv-index").css("color", "white")
            } else {
                $("#uv-index").css("background-color", "purple")
                $("#uv-index").css("color", "white")
            }
        });

        city.val("")
        var historyNumber = []

        searchHistory.append($("<li>").text(cityResp).attr("data-index", 0));
        historyNumber = historyNumber.push(cityInput)
        console.log(historyNumber)


    });

    //fetch forecast data

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (forecastResp) {
        console.log(forecastResp)
        console.log(moment().format())
        console.log(forecastResp.list[0].dt_txt)
        var forecastDate = forecastResp.list[0].dt_txt
        $("#forecast-date").text(forecastDate)


        console.log(forecastResp.list[0].weather[0].icon)

        var iconOne = forecastResp.list[0].weather[0].icon
        var iconOneURL = "http://openweathermap.org/img/wn/" + iconOne + "@2x.png"
        $("img #forecast-condition1").attr("src", iconOneURL)

        console.log(forecastResp.list[0].main.temp)
        console.log(forecastResp.list[0].main.humidity)

    })
}




//hitorical searh button
searchHistory.on("click", function (event) {
    var element = event.target;

    if (element.matches("li")) {
        cityInput = $("li").text()
        weatherData()
    }
})


var pastSearch = [];

    //searched city first letter capital
    //cityInput = cityInput.charAt(0).toUpperCase() + cityInput.slice(1).toLowerCase()




    // function renderHistory() {

    //     console.log(pastSearch)

    //     for (var i = 0; i < pastSearch.length; i++) {
    //         var search = pastSearch[i];

    //         $("#past-search").append($("<li>").text(search).attr("data-index", i))
    //     }

    // }
    // console.log(pastSearch)
    // renderHistory()



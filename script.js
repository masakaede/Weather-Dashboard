
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
var kelvinCalc = 273.15

var forecastDayOne = moment().add(1, 'days').format("DD/MM/YYYY")
var forecastDayTwo = moment().add(2, 'days').format("DD/MM/YYYY")
var forecastDayThree = moment().add(3, 'days').format("DD/MM/YYYY")
var forecastDayFour = moment().add(4, 'days').format("DD/MM/YYYY")
var forecastDayFive = moment().add(5, 'days').format("DD/MM/YYYY")

console.log(forecastDayOne)
console.log(forecastDayTwo)
console.log(forecastDayThree)
console.log(forecastDayFour)
console.log(forecastDayFive)

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

        var degreeCel = currentResp.main.temp - kelvinCalc
        degreeCel = degreeCel.toFixed(1)

        cityResp = currentResp.name + ", " + currentResp.sys.country

        $("#city-name").text(cityResp + " (" + currentTime + ")");
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


    //constructor function
    // function forecastObj(card, date, condition, temperature, humidity, arrayNumber) {
    //     this.card = card;
    //     this.date = date;
    //     this.condition = condition;
    //     this.temperature = temperature;
    //     this.humidity = humidity;
    //     this.arrayNumber = arrayNumber;
    // }
    function forecastObj(date, arrayNumber) {
        this.date = date;
        this.arrayNumber = arrayNumber;
    }

    var dayOne = new forecastObj(forecastDayOne, 7)
    var dayTwo = new forecastObj(forecastDayTwo, 15)
    var dayThree = new forecastObj(forecastDayThree, 23)
    var dayFour = new forecastObj(forecastDayFour, 31)
    var dayFive = new forecastObj(forecastDayFive, 39)


    var dayArray = [dayOne, dayTwo, dayThree, dayFour, dayFive];

    //fetch forecast data
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (forecastResp) {
        console.log(forecastResp)

        var iconOne = forecastResp.list[7].weather[0].icon
        var iconOneURL = "http://openweathermap.org/img/wn/" + iconOne + "@2x.png"
        $("#forecast-date-1").text(forecastDayOne);
        $("#forecast-condition-1").attr("src", iconOneURL)
        $("#forecast-temp-1").text("Temp: " + (forecastResp.list[7].main.temp - kelvinCalc).toFixed(1) + "°C");
        $("#forecast-humi-1").text("Humidity: " + forecastResp.list[7].main.humidity + "%");

        var iconTwo = forecastResp.list[15].weather[0].icon
        var iconTwoURL = "http://openweathermap.org/img/wn/" + iconTwo + "@2x.png"
        $("#forecast-date-2").text(forecastDayTwo);
        $("#forecast-condition-2").attr("src", iconTwoURL)
        $("#forecast-temp-2").text("Temp: " + (forecastResp.list[15].main.temp - kelvinCalc).toFixed(1) + "°C");
        $("#forecast-humi-2").text("Humidity: " + forecastResp.list[15].main.humidity + "%");

        var iconThree = forecastResp.list[23].weather[0].icon
        var iconThreeURL = "http://openweathermap.org/img/wn/" + iconThree + "@2x.png"
        $("#forecast-date-3").text(forecastDayThree);
        $("#forecast-condition-3").attr("src", iconThreeURL)
        $("#forecast-temp-3").text("Temp: " + (forecastResp.list[23].main.temp - kelvinCalc).toFixed(1) + "°C");
        $("#forecast-humi-3").text("Humidity: " + forecastResp.list[23].main.humidity + "%");

        var iconFour = forecastResp.list[31].weather[0].icon
        var iconFourURL = "http://openweathermap.org/img/wn/" + iconFour + "@2x.png"
        $("#forecast-date-4").text(forecastDayFour);
        $("#forecast-condition-4").attr("src", iconFourURL)
        $("#forecast-temp-4").text("Temp: " + (forecastResp.list[31].main.temp - kelvinCalc).toFixed(1) + "°C");
        $("#forecast-humi-4").text("Humidity: " + forecastResp.list[31].main.humidity + "%");

        var iconFive = forecastResp.list[39].weather[0].icon
        var iconFiveURL = "http://openweathermap.org/img/wn/" + iconFive + "@2x.png"
        $("#forecast-date-5").text(forecastDayFive);
        $("#forecast-condition-5").attr("src", iconFiveURL)
        $("#forecast-temp-5").text("Temp: " + (forecastResp.list[39].main.temp - kelvinCalc).toFixed(1) + "°C");
        $("#forecast-humi-5").text("Humidity: " + forecastResp.list[39].main.humidity + "%");


        // for (var i = 0; i < dayArray.length; i++) {
        //     console.log(dayArray[i].arrayNumber);

        //     var iconOne = forecastResp.list[dayArray[i].arrayNumber].weather[0].icon
        //     console.log(forecastResp.list[dayArray[i].arrayNumber].weather[0].icon)
        //     var iconOneURL = "http://openweathermap.org/img/wn/" + iconOne + "@2x.png"
        //     //$("img #forecast-condition1").attr("src", iconOneURL)
        //     console.log(dayArray[i].date)

        //     $(".forecast-cards").append("<div class='col-2 forecast-result mr-auto'>");
        //     $(".forecast-result").append("<div class='forecast-date'>")
        // $(".forecast-date").text(dayArray[i].date)
        // $(".forecast-result").append("<br>")
        // $(".forecast-result").append("<img>").attr("src", iconOneURL)
        // $(".forecast-result").append("<br>")
        // $(".forecast-result").append("<div>").text(forecastResp.list[dayArray[i].arrayNumber].main.temp)
        // $(".forecast-result").append("<br>")
        // $(".forecast-result").append("<div>").text(forecastResp.list[dayArray[i].arrayNumber].main.humidity)

        // console.log(forecastResp.list[dayArray[i].arrayNumber].main.temp)
        // console.log(forecastResp.list[dayArray[i].arrayNumber].main.humidity)
        // }


        // $(".forecast-cards").append("div").addClass("forecast-result mr-auto");
        // $(".forecast-result").append("div").text(dayArray[i].date)
        // $(".forecast-result").append("br")
        // $(".forecast-result").append("img").attr("src", iconOneURL)
        // $(".forecast-result").append("br")
        // $(".forecast-result").append("div").text(forecastResp.list[dayArray[i].arrayNumber].main.temp)
        // $(".forecast-result").append("br")
        // $(".forecast-result").append("div").text(forecastResp.list[dayArray[i].arrayNumber].main.humidity)
    })
    // $(".forecast-cards").append("<div class='col-2 forecast-result mr-auto'>");
    // $(".forecast-result").append("<div class='forecast-date'>")
    // $(".forecast-date").text(dayArray[0].date)
    // $(".forecast-result").append("<br>")

    //$(".forecast-result").append("img").attr("src", iconOneURL)
    // $("#forecast-date").text(forecastDayOne)

    // console.log(forecastResp.list[0].weather[0].icon)

    // console.log(forecastResp.list[0].main.temp)
    // console.log(forecastResp.list[0].main.humidity)

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



$("document").ready(function () {

    var apiKey = "cc6475a579b89b1bda38866e3fd95407"
    var cityResp = ""
    var searchHistory = $("#search-history")
    var lat = 0;
    var lon = 0;
    var queryCurrentURL;
    var queryUvURL;
    var forecastURL;
    var city = $("#city-input");
    var cityInput;
    var currentTime = moment().format("DD/MM/YYYY");
    var kelvinCalc = 273.15;
    var currentUv;
    var historyNumber = [];

    var forecastDayOne = moment().add(1, 'days').format("DD/MM/YYYY");
    var forecastDayTwo = moment().add(2, 'days').format("DD/MM/YYYY");
    var forecastDayThree = moment().add(3, 'days').format("DD/MM/YYYY");
    var forecastDayFour = moment().add(4, 'days').format("DD/MM/YYYY");
    var forecastDayFive = moment().add(5, 'days').format("DD/MM/YYYY");

    // run init function to show last search result
    init();

    // current weather data function
    function weatherData() {
        queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + apiKey;
        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + apiKey;

        // fetch current weather data
        $.ajax({
            url: queryCurrentURL,
            method: "GET"
        }).then(function (currentResp) {

            var degreeCel = currentResp.main.temp - kelvinCalc;
            degreeCel = degreeCel.toFixed(1);
            cityResp = currentResp.name + ", " + currentResp.sys.country;

            var cityName = cityResp + " (" + currentTime + ")";
            var currentTemp = degreeCel + "°C";
            var currentHumi = currentResp.main.humidity + "%";
            var currentWind = currentResp.wind.speed + " MPH";

            $("#city-name").text(cityName);
            $("#temperature").text(currentTemp);
            $("#humidity").text(currentHumi);
            $("#wind-speed").text(currentWind);
            lat = currentResp.coord.lat;
            lon = currentResp.coord.lon;

            //weather icon
            var icon = currentResp.weather[0].icon
            var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            $("#current-icon").attr("src", iconURL)

            //fetch uv data
            queryUvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

            $.ajax({
                url: queryUvURL,
                method: "GET"
            }).then(function (uvResp) {
                currentUv = uvResp.value
                $("#uv-index").text(currentUv);

                currentUvColor();

                //set local storage of current weather
                var currentWeather = {
                    cityName: cityName,
                    iconURL: iconURL,
                    currentTemp: currentTemp,
                    currentHumi: currentHumi,
                    currentWind: currentWind,
                    currentUv: currentUv
                };
                localStorage.setItem("currentWeather", JSON.stringify(currentWeather));
            });

            //store history
            if (historyNumber.indexOf(cityResp) < 0) {
                searchHistory.append($("<li>").text(cityResp).attr("class", "past-search"));
                historyNumber.push(cityResp)
            }

            //clear search cell
            city.val("")
        });

        //fetch forecast data
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (forecastResp) {
            //day one
            var iconOne = forecastResp.list[7].weather[0].icon;
            var iconOneURL = "https://openweathermap.org/img/wn/" + iconOne + "@2x.png";
            var temperpatureOne = "Temp: " + (forecastResp.list[7].main.temp - kelvinCalc).toFixed(1) + "°C";
            var humidityOne = "Humidity: " + forecastResp.list[7].main.humidity + "%";
            $("#forecast-date-1").text(forecastDayOne);
            $("#forecast-condition-1").attr("src", iconOneURL);
            $("#forecast-temp-1").text(temperpatureOne);
            $("#forecast-humi-1").text(humidityOne);

            //day two
            var iconTwo = forecastResp.list[15].weather[0].icon;
            var iconTwoURL = "https://openweathermap.org/img/wn/" + iconTwo + "@2x.png";
            var temperatureTwo = "Temp: " + (forecastResp.list[15].main.temp - kelvinCalc).toFixed(1) + "°C";
            var humidityTwo = "Humidity: " + forecastResp.list[15].main.humidity + "%";
            $("#forecast-date-2").text(forecastDayTwo);
            $("#forecast-condition-2").attr("src", iconTwoURL);
            $("#forecast-temp-2").text(temperatureTwo);
            $("#forecast-humi-2").text(humidityTwo);

            //day three
            var iconThree = forecastResp.list[23].weather[0].icon;
            var iconThreeURL = "https://openweathermap.org/img/wn/" + iconThree + "@2x.png";
            var temperatureThree = "Temp: " + (forecastResp.list[23].main.temp - kelvinCalc).toFixed(1) + "°C";
            var humidityThree = "Humidity: " + forecastResp.list[23].main.humidity + "%";
            $("#forecast-date-3").text(forecastDayThree);
            $("#forecast-condition-3").attr("src", iconThreeURL);
            $("#forecast-temp-3").text(temperatureThree);
            $("#forecast-humi-3").text(humidityThree);

            //day four
            var iconFour = forecastResp.list[31].weather[0].icon;
            var iconFourURL = "https://openweathermap.org/img/wn/" + iconFour + "@2x.png";
            var temperatureFour = "Temp: " + (forecastResp.list[31].main.temp - kelvinCalc).toFixed(1) + "°C";
            var humidityFour = "Humidity: " + forecastResp.list[31].main.humidity + "%";
            $("#forecast-date-4").text(forecastDayFour);
            $("#forecast-condition-4").attr("src", iconFourURL);
            $("#forecast-temp-4").text(temperatureFour);
            $("#forecast-humi-4").text(humidityFour);

            //day five
            var iconFive = forecastResp.list[39].weather[0].icon
            var iconFiveURL = "https://openweathermap.org/img/wn/" + iconFive + "@2x.png";
            var temperatureFive = "Temp: " + (forecastResp.list[39].main.temp - kelvinCalc).toFixed(1) + "°C";
            var humidityFive = "Humidity: " + forecastResp.list[39].main.humidity + "%";
            $("#forecast-date-5").text(forecastDayFive);
            $("#forecast-condition-5").attr("src", iconFiveURL);
            $("#forecast-temp-5").text(temperatureFive);
            $("#forecast-humi-5").text(humidityFive);

            //set local storage of forecast weather
            var forecastWeather = {
                forecastDayOne: forecastDayOne,
                iconOneURL: iconOneURL,
                temperpatureOne: temperpatureOne,
                humidityOne: humidityOne,
                forecastDayTwo: forecastDayTwo,
                iconTwoURL: iconTwoURL,
                temperatureTwo: temperatureTwo,
                humidityTwo: humidityTwo,
                forecastDayThree: forecastDayThree,
                iconThreeURL: iconThreeURL,
                temperatureThree: temperatureThree,
                humidityThree: humidityThree,
                forecastDayFour: forecastDayFour,
                iconFourURL: iconFourURL,
                temperatureFour: temperatureFour,
                humidityFour: humidityFour,
                forecastDayFive: forecastDayFive,
                iconFiveURL: iconFiveURL,
                temperatureFive: temperatureFive,
                humidityFive: humidityFive
            };
            localStorage.setItem("forecastWeather", JSON.stringify(forecastWeather));
        })
    }

    //function to retrieve last search data
    function init() {
        var storedCurrent = JSON.parse(localStorage.getItem("currentWeather"));

        if (storedCurrent !== null) {
            $("#city-name").text(storedCurrent.cityName);
            $("#current-icon").attr("src", storedCurrent.iconURL)
            $("#temperature").text(storedCurrent.currentTemp);
            $("#humidity").text(storedCurrent.currentHumi);
            $("#wind-speed").text(storedCurrent.currentWind);
            $("#uv-index").text(storedCurrent.currentUv);
            currentUv = storedCurrent.currentUv;
            currentUvColor();
        }


        var storedForecast = JSON.parse(localStorage.getItem("forecastWeather"));
        if (storedForecast !== null) {
            $("#forecast-date-1").text(storedForecast.forecastDayOne);
            $("#forecast-condition-1").attr("src", storedForecast.iconOneURL);
            $("#forecast-temp-1").text(storedForecast.temperpatureOne);
            $("#forecast-humi-1").text(storedForecast.humidityOne);

            $("#forecast-date-2").text(storedForecast.forecastDayTwo);
            $("#forecast-condition-2").attr("src", storedForecast.iconTwoURL);
            $("#forecast-temp-2").text(storedForecast.temperatureTwo);
            $("#forecast-humi-2").text(storedForecast.humidityTwo);

            $("#forecast-date-3").text(storedForecast.forecastDayThree);
            $("#forecast-condition-3").attr("src", storedForecast.iconThreeURL);
            $("#forecast-temp-3").text(storedForecast.temperatureThree);
            $("#forecast-humi-3").text(storedForecast.humidityThree);

            $("#forecast-date-4").text(storedForecast.forecastDayFour);
            $("#forecast-condition-4").attr("src", storedForecast.iconFourURL);
            $("#forecast-temp-4").text(storedForecast.temperatureFour);
            $("#forecast-humi-4").text(storedForecast.humidityFour);

            $("#forecast-date-5").text(storedForecast.forecastDayFive);
            $("#forecast-condition-5").attr("src", storedForecast.iconFiveURL);
            $("#forecast-temp-5").text(storedForecast.temperatureFive);
            $("#forecast-humi-5").text(storedForecast.humidityFive);
        }
    }

    // function to change UV background color
    function currentUvColor() {
        if (currentUv < 3) {
            $("#uv-index").css("background-color", "rgb(13, 214, 13)")
            $("#uv-index").css("color", "black")
        } else if (currentUv < 6) {
            $("#uv-index").css("background-color", "rgb(255, 255, 17)")
            $("#uv-index").css("color", "black")
        } else if (currentUv < 8) {
            $("#uv-index").css("background-color", "orange")
            $("#uv-index").css("color", "black")
        } else if (currentUv < 11) {
            $("#uv-index").css("background-color", "red")
            $("#uv-index").css("color", "white")
        } else {
            $("#uv-index").css("background-color", "purple")
            $("#uv-index").css("color", "white")
        }
    }

    // search click event
    $("#find-city").on("click", function (event) {
        event.preventDefault();
        cityInput = city.val();
        weatherData();
    })

    //hitorical searh button
    searchHistory.on("click", 'li', function () {

        cityInput = $(this).text()
        weatherData()
    })
})
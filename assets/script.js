var apiKey = "545b3fef98c715931d6211ebae44a665";

$(document).ready(function(){

    var cities = [];

    //API call to display forecast for city  
    function cityForcast(city){
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var weatherIcon = response.weather[0].icon;
            var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            var date = $("<h2>").text(moment().format('l'));
            var tempFar = (response.main.temp - 273.15) * 1.80 + 32;
            
            var lat = response.coord.lat
            var lon = response.coord.lon

            $("#city").text(response.name);
            $("#city").append(date);
            $("#city").append(icon);
            $("#temp").text(tempFar.toFixed(2) + " \u00B0F");
            $("#humidity").text(response.main.humidity + "%");
            $("#windSpeed").text(response.wind.speed + "MPH");

            

            queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon; 
           
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response){

        // sets classes for UV index 
            var uvIndex = response.value;

            $("#UVindex").removeClass("fair");
            $("#UVindex").removeClass("moderate");
            $("#UVindex").removeClass("severe");
                if (uvIndex <= 2.9){
                    $("#UVindex").addClass("fair");
                } else if (uvIndex >= 3 && uvIndex <= 7.9){
                    $("#UVindex").addClass("moderate");
                } else {
                    $("#UVindex").addClass("severe");};
                    $("#UVindex").text(response.value);});   
                    $("#cityDisplay").show();});
                };

    //5 day api forcast
    function fiveDay(city){
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;
                
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){

            var counter = 1
            for(var i=0; i < response.list.length; i += 8){

                var temperatureF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                var date = moment(response.list[i].dt_txt).format("l");
                var weatherIcon = response.list[i].weather[0].icon;
                
                                
                $("#day-" + counter).text(date);
                $("#pic-" + counter).attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");
                $("#temperature-" + counter).text(temperatureF.toFixed(2) + " \u00B0F");
                $("#humidity-" + counter).text(response.list[i].main.humidity + "%"); counter++;};
                $("#fiveday").show();   
                });
                };
    // search city 
    function citySearch(city){
        var cityList = $("<li>").text(city)
        cityList.addClass("searchedCity");
        $("#searchedCity").append(cityList);};
                
    //clear city            
    function getCity(){
        $("#searchedCity").empty();
        for (var i = 0; i < cities.length; i++) { 
            citySearch(cities[i]);
        };};
                
    function weather(city){
        cityForcast(city);
        fiveDay(city);};
    function init() {
            
    var storedCities = JSON.parse(localStorage.getItem("searches"));
        if (storedCities) {
            cities = storedCities;
            getCity();
            weather(cities[cities.length -1]);
        };};
    init();

$("#searchBtn").click(function(){
    var cityInputs = $(this).siblings("#cityInput").val().trim();
    $("#cityInput").val("");
    if (cityInputs !== ""){
        if (cities.indexOf(cityInputs)== -1){
            cities.push(cityInputs);
            localStorage.setItem("searches",JSON.stringify(cities));
            citySearch(cityInputs);
        };
        weather(cityInputs);};
});
$("#searchedCity").on("click", ".searchedCity", function(){
    var cityBtn = $(this).text();
    weather(cityBtn);
});
});
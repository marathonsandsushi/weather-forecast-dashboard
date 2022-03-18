function initPage() {


  // store the value of the input
  let city = $("#searchTerm").val();
  // store api key
  const apiKey = "&appid=afaa8eea1769b4359fd8e07b2efcefbd";
  let date = new Date();

  $("#searchTerm").keypress(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      $("#searchBtn").click();
    }
  });

  $("#searchBtn").on("click", function () {
    $("#forecastH5").addClass("show");

    // get the value of the input from user
    city = $("#searchTerm").val();

    // clear input box
    $("#searchTerm").val("");

    createWeatherReport(city);

  });


function createWeatherReport(city) {
    

    console.log("KOOOOOOOOOKO" + city);

    const latLonURL =
      "http://api.openweathermap.org/geo/1.0/direct?q=" + city + apiKey;
    $.ajax({
      url: latLonURL,
      method: "GET",
    }).then(function (response) {
      
        getUVIndex(response[0].lat, response[0].lon, city);

    });
}


function getUVIndex (lat, lon, city) {
    
    const UVIurl =
    "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + apiKey;
  $.ajax({
    url: UVIurl,
    method: "GET",
  }).then(function (response) {

    let myUvi = response.current.uvi;

    // full url to call api
    const queryUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

    $.ajax({
        url: queryUrl,
        method: "GET",
    }).then(function (response) {
        let tempF = (response.main.temp - 273.15) * 1.8 + 32;

        getCurrentConditions(response, myUvi);
        getCurrentForecast(response);
        makeList();
    });

  });
}

  // add city to search history
  function makeList() {

    const cityElID = city.replace(' ', "-");

    if($(`#${cityElID}`).length ) return;
 

    let listItem = $("<button>").addClass("list-group-item").attr("id", cityElID).text(city);

    $(".list").append(listItem);

    $(`#${cityElID}`).click(function () {
      const id = $(this).attr('id');
      let myCity = id.replace('-', ' ');
      cityRevist(myCity);
    });
    
  }

  function cityRevist (city) {
    console.log(`cityRevist  - ${city}`);
    createWeatherReport(city);
  }

  function getCurrentConditions(response, currentUvi) {
    // get the temperature and convert to fahrenheit
    let tempF = (response.main.temp - 273.15) * 1.8 + 32;
    tempF = Math.floor(tempF);

    $("#currentCity").empty();

    // get and set the current weather content
    const card = $("<div>").addClass("card");
    const cardBody = $("<div>").addClass("card-body");
    const city = $("<h4>").addClass("card-title").text(response.name);
    const cityDate = $("<h4>")
      .addClass("card-title")
      .text(date.toLocaleDateString("en-US"));
    const temperature = $("<p>")
      .addClass("card-text current-temp")
      .text("Temperature: " + tempF + " °F");
    const humidity = $("<p>")
      .addClass("card-text current-humidity")
      .text("Humidity: " + response.main.humidity + "%");
    const wind = $("<p>")
      .addClass("card-text current-wind")
      .text("Wind Speed: " + response.wind.speed + " MPH");
    const todayUvi = $("<p>")
      .addClass("card-text current-uvi")
      .text("UV Index: " + currentUvi);
    const image = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );

    // append to page
    city.append(cityDate, image);
    cardBody.append(city, temperature, humidity, wind, todayUvi);
    card.append(cardBody);
    $("#currentCity").append(card);
  }
  
  function getCurrentForecast() {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
      method: "GET",
    }).then(function (response) {
      $("#forecast").empty();

      // variable to hold response.list
      let results = response.list;

      //declare start date to check against
      // startDate = 20
      //have end date, endDate = startDate + 5

      for (let i = 0; i < results.length; i++) {
        let day = Number(results[i].dt_txt.split("-")[2].split(" ")[0]);
        let hour = results[i].dt_txt.split("-")[2].split(" ")[1];

        if (results[i].dt_txt.indexOf("12:00:00") !== -1) {
          // get the temperature and convert to fahrenheit
          let temp = (results[i].main.temp - 273.15) * 1.8 + 32;
          let tempF = Math.floor(temp);

          const card = $("<div>").addClass(
            "card col-md-2 ml-4 bg-primary text-white"
          );
          const cardBody = $("<div>").addClass("card-body p-3 forecastBody");
          const cityDate = $("<h4>")
            .addClass("card-title")
            .text(date.toLocaleDateString("en-US"));
          const temperature = $("<p>")
            .addClass("card-text forecastTemp")
            .text("Temp: " + tempF + " °F");
          const wind = $("<p>")
            .addClass("card-text forecastWind")
            .text("Wind Speed: " + results[i].wind.speed + " MPH");
          const humidity = $("<p>")
            .addClass("card-text forecastHumidity")
            .text("Humidity: " + results[i].main.humidity + "%");

          const image = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              results[i].weather[0].icon +
              ".png"
          );

          cardBody.append(cityDate, image, temperature, wind, humidity);
          card.append(cardBody);
          $("#forecast").append(card);
        }
      }
    });
  }
}
initPage();

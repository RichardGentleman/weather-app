const express = require("express");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home-page");
});

app.post("/", function (req, res) {
  const query = _.startCase(req.body.cityName);
  const apiKey = "";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=metric&appid=" +
    apiKey;
  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = _.startCase(
        weatherData.weather[0].description
      );
      const wind = weatherData.wind.speed;
      const pressure = weatherData.main.pressure;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("forecast", {
        query: query,
        temp: temp,
        weatherDescription: weatherDescription,
        wind: wind,
        pressure: pressure,
        imageURL: imageURL,
      });
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});

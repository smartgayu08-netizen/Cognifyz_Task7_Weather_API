const express = require("express");
const axios = require("axios");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const API_KEY = "b166e2159f5210237cbd8e68fa1fdcc9";
let requestCount = 0;

app.get("/", (req, res) => {
    res.render("index", {
        weather: null,
        error: null
    });
});

app.post("/weather", async (req, res) => {

    requestCount++;

    if(requestCount > 10){
        return res.render("index", {
            weather: null,
            error: "Too many requests. Try again later."
        });
    }

    const city = req.body.city;

    try{

        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await axios.get(url);

        const weather = {
            city: response.data.name,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            condition: response.data.weather[0].description
        };

        res.render("index", {
            weather,
            error: null
        });

    }catch(error){

        res.render("index", {
            weather: null,
            error: "City not found!"
        });

    }

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
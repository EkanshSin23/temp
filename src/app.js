const express = require('express');
const requests = require("requests")
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
const path = require('path');
app.set('view engine', 'hbs');
app.get('/', (req, res) => {
    try {
        res.render('index',
            {
                temp: 50
            })
    } catch (error) {
        console.log(error);
    }
})
app.post("/", (req, res) => {
    try {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=2f7409b1c51afd33fab8853b995deeba`)
            .on('data', (chunk) => {
                const weather = JSON.parse(chunk);

                if (weather.main == undefined) {
                    res.render('index', {
                        w: false,

                        city: req.body.city,
                        temp: " not available"

                    })
                }

                else {
                    res.render('index', {
                        w: true,

                        city: req.body.city,
                        temp: weather.main.temp

                    })
                }

            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);

                console.log('end');
            });



    } catch (error) {
        console.log(error);
    }
});
app.listen(8000, () => {
    console.log("8000");
})
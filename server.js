const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios');

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

const SERVER_PORT = 3001;

const startupCallback = () => {
    console.log(`Server started at: http://localhost:${service.address().port}`);
};


server.get('/', (req, res) => {

    axios({
        method: 'get',
        url: 'https://api.privatbank.ua/p24api/exchange_rates?json&date=01.12.2020'
    })
        .then(response => {
            console.log(response.data.exchangeRate[23]);

            res.send(response.data);
        })
        .catch(error => {
            res.send(error);
        })
})





const service = server.listen(SERVER_PORT, startupCallback)
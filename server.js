const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios');
const TeleBot = require('telebot');
const Pool = require('pg').Pool;

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'history',
    password: '123456',
    port: 5432,
    ssl: false
});

const SERVER_PORT = 3001;

const TELEGRAM_BOT_TOKEN = "1545875277:AAEqj7EcbMLq1POWeiJHoJz8_2wxufrrRfs";

const BUTTONS = {
    hello: {
        label: '👋 Hello',
        command: '/hello'
    },
    world: {
        label: '🌍 Now Date',
        command: '/now'
    },
    hide: {
        label: '⌨️ Hide keyboard',
        command: '/hide'
    }
};

const bot = new TeleBot({
    token: TELEGRAM_BOT_TOKEN,
    usePlugins: ['namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});



bot.on(/^\d{2}(.)\d{2}\1\d{4}$/, (msg) => {

    axios({
        method: 'get',
        url: `https://api.privatbank.ua/p24api/exchange_rates?json&date=${msg.text}`
    })
        .then(response => {
            // console.log(response.data.exchangeRate[23]);
            let itemUSD = response.data.exchangeRate.filter(item => item.currency === "USD");
            console.log(itemUSD);

            msg.reply.text(`SaleRate: ${itemUSD[0].saleRate} UAH \nPurchaseRate: ${itemUSD[0].purchaseRate} UAH`);
        })
        .catch(error => {
            msg.reply.text(error.message);
        })
});

bot.on('/now', (msg) => {
    let date = new Date(Date.now());
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    console.log(day);
    console.log(month);
    console.log(year);
    axios({
        method: 'get',
        url: `https://api.privatbank.ua/p24api/exchange_rates?json&date=${day}.${month}.${year}`
    })
        .then(response => {
            let itemUSD = response.data.exchangeRate.filter(item => item.currency === "USD");
            // console.log(msg);

            pool.query('INSERT INTO history (query, user_name, date, answer) VALUES ($1, $2, $3, $4) RETURNING *', 
            ['/now', msg.from.first_name, date.toISOString(), 
            `SaleRate: ${itemUSD[0].saleRate} UAH PurchaseRate: ${itemUSD[0].purchaseRate} UAH`], (error, results) => {

                msg.reply.text(`SaleRate: ${itemUSD[0].saleRate} UAH \nPurchaseRate: ${itemUSD[0].purchaseRate} UAH`);
            })

        })
        .catch(error => {
            msg.reply.text(error.message);
        })
});

bot.on('/hide', (msg) => msg.reply.text('Type /start to show keyboard again.', { replyMarkup: 'hide' }));

bot.on('/hello', (msg) => msg.reply.text('Welcome! \nEnter the date in the format \'dd.mm.yyyy\'\nor \'/now\' for the current date'));

bot.on('/start', (msg) => {

    let replyMarkup = bot.keyboard([
        [BUTTONS.hello.label, BUTTONS.world.label],
        [BUTTONS.hide.label]
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'See keyboard below.', { replyMarkup });

});

bot.start();





// const startupCallback = () => {
//     console.log(`Server started at: http://localhost:${service.address().port}`);
// };




// server.get('/', (req, res) => {

//     axios({
//         method: 'get',
//         url: 'https://api.privatbank.ua/p24api/exchange_rates?json&date=05.03.2021'
//     })
//         .then(response => {
//             // console.log(response.data.exchangeRate[23]);
//             let itemUSD = response.data.exchangeRate.filter(item => item.currency==="USD");
//             console.log(itemUSD);

//             res.send(itemUSD);
//         })
//         .catch(error => {
//             res.send(error);
//         })
// })





// const service = server.listen(SERVER_PORT, startupCallback)
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios');
const TeleBot = require('telebot');
const service = require('./service')

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

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
    polling: {
        interval: 1000, // Optional. How often check updates (in ms).
        timeout : 100 ,
        retryTimeout : 1000 ,
    },
    usePlugins: ['namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});

bot.on(/^\d{2}(.)\d{2}\1\d{4}$/, (msg) => {

    let date = new Date(Date.now());

    axios({
        method: 'get',
        url: `https://api.privatbank.ua/p24api/exchange_rates?json&date=${msg.text}`
    })
        .then(response => {
            let itemUSD = response.data.exchangeRate.filter(item => item.currency === "USD");

            service.insertDB(msg.text, msg.from.first_name, date.toISOString(),
                `SaleRate: ${itemUSD[0].saleRate} UAH PurchaseRate: ${itemUSD[0].purchaseRate} UAH`)
                .then(() => {
                    msg.reply.text(`SaleRate: ${itemUSD[0].saleRate} UAH \nPurchaseRate: ${itemUSD[0].purchaseRate} UAH`);
                })
                .catch(error => {
                    msg.reply.text(error.message);
                })
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

    axios({
        method: 'get',
        url: `https://api.privatbank.ua/p24api/exchange_rates?json&date=${day}.${month}.${year}`
    })
        .then(response => {
            let itemUSD = response.data.exchangeRate.filter(item => item.currency === "USD");
            // console.log(msg);
            service.insertDB(msg.text, msg.from.first_name, date.toISOString(),
                `SaleRate: ${itemUSD[0].saleRate} UAH PurchaseRate: ${itemUSD[0].purchaseRate} UAH`)
                .then(() => {
                    msg.reply.text(`SaleRate: ${itemUSD[0].saleRate} UAH \nPurchaseRate: ${itemUSD[0].purchaseRate} UAH`);
                })
                .catch(error => {
                    msg.reply.text(error.message);
                })

        })
        .catch(error => {
            msg.reply.text(error.message);
        })
});

bot.on('/hide', (msg) => {

    let date = new Date(Date.now());

    service.insertDB(msg.text, msg.from.first_name, date.toISOString(),
        'Type /start to show keyboard again.')
        .then(() => {
            msg.reply.text('Type /start to show keyboard again.', { replyMarkup: 'hide' });
        })
        .catch(error => {
            msg.reply.text(error.message);
        })

});

bot.on('/hello', (msg) => {

    let date = new Date(Date.now());

    service.insertDB(msg.text, msg.from.first_name, date.toISOString(),
        'Welcome! Enter the date in the format \'dd.mm.yyyy\' or \'/now\' for the current date')
        .then(() => {
            msg.reply.text('Welcome! \nEnter the date in the format \'dd.mm.yyyy\'\nor \'/now\' for the current date');
        })
        .catch(error => {
            msg.reply.text(error.message);
        })

});


bot.on('/start', (msg) => {

    let date = new Date(Date.now());

    service.insertDB(msg.text, msg.from.first_name, date.toISOString(),
        `See keyboard below. id = ${msg.chat.id}`)
        .then(() => {
            console.log('kkk')
            let replyMarkup = bot.keyboard([
                [BUTTONS.hello.label, BUTTONS.world.label],
                [BUTTONS.hide.label]
            ], { resize: true });

            return bot.sendMessage(msg.chat.id, 'See keyboard below.', { replyMarkup });

        })
        .catch(error => {
            msg.reply.text(error.message);
        })

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
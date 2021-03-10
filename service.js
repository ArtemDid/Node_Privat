const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'history',
    password: '123456',
    port: 5432,
    ssl: false
});

const insertDB = (query, user_name, date, answer) => {
    return new Promise(function (resolve, reject) {
        console.log("qqq")
        if (pool!==undefined) {
            console.log("bbb")
            pool.query('INSERT INTO history (query, user_name, date, answer) VALUES ($1, $2, $3, $4) RETURNING *',
                [query, user_name, date, answer], (error, results) => {
                    if (error) {
                        reject(error)
                    }
                    if (results===undefined) {
                        resolve('OK');
                    }
                    console.log("ggg")
                });
        }
        else {
            resolve('OK');
            console.log("aaa")
        }
    })
}







module.exports = { insertDB }
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

        pool.query('INSERT INTO history (query, user_name, date, answer) VALUES ($1, $2, $3, $4) RETURNING *',
            [query, user_name, date, answer], (error, results) => {
                if (error) {
                    reject(error)
                }
                if (results.rows[0].id==='undefined') {
                    resolve('OK');
                }
                console.log(results.rows[0].id)
            });

    })
}







module.exports = { insertDB }
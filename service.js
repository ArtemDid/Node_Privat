// const Pool = require('pg').Pool;

// const pool = new Pool({
//     user: 'ztcjytohfqbrnk',
//     host: process.env.DATABASE_URL || 'localhost', // postgres://ztcjytohfqbrnk:e9fbda1f66ad087d9ae21bc906f5e7db3bb0d99830e5adf254da1411fa24166d@ec2-54-73-147-133.eu-west-1.compute.amazonaws.com:5432/deq0a3s66rcipk
//     database: 'deq0a3s66rcipk',
//     password: 'e9fbda1f66ad087d9ae21bc906f5e7db3bb0d99830e5adf254da1411fa24166d',
//     port: 5432
// });

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const insertDB = (query, user_name, date, answer) => {
    return new Promise(function (resolve, reject) {
        console.log("bbb")
        client.query('INSERT INTO deq0a3s66rcipk (query, user_name, date, answer) VALUES ($1, $2, $3, $4) RETURNING *',
            [query, user_name, date, answer], (error, results) => {
                if (error) {
                    reject(error)
                }
                if (results === undefined) {
                    resolve('OK');
                }
                console.log("ggg")
            });
    })
}







module.exports = { insertDB }
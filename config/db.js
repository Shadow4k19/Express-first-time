const dotenv = require('dotenv');
const mysql = require('mysql2');

/*Get All data in file .env*/
dotenv.config();

/*DB Connection */
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

/*DB Connection*/ 
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
});

/*Export module*/
module.exports = db;

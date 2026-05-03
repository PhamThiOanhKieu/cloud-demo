const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'nodeuser',
    password: '123456',
    database: 'bright_academy'
});

module.exports = db;

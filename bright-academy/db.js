const mysql = require('mysql2');

const connection = mysql.createConnection({

    host:'localhost',

    user:'brightuser',

    password:'123456',

    database:'bright_academy'

});

module.exports = connection.promise();

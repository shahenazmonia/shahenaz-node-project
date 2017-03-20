var pg = require('pg')
var env = require('env2')
env('config.env');
var config = {
    user: process.env.DB_USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
}

module.exports = () => {

    var client = new pg.Client(config);
    

    client.connect(err => {
        if (err) {
            throw err
        }
    })
    return client;
}

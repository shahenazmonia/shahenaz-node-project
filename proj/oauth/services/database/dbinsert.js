module.exports = (client,user, cb) => {
    client.query(`INSERT INTO users (username,password) VALUES ('${user[0]}','${user[1]}')`, (err, result) => {
        if (err) {
            throw err;
        }
        cb(undefined, result)
    });

}

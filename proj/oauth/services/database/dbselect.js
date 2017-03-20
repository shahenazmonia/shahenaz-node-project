
module.exports = (client,id, cb) => {
    client.query(`SELECT * FROM session WHERE id=${id}`, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result.rows);
         cb(undefined, result.rows)
    });

}

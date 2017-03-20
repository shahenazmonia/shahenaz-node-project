const github = require('./../services/github');

module.exports = (req, reply) => {
    github.fetchToken(req.query.code, (access_token) => {
        github.getResource('user', access_token, (err, user) => {
            reply.view('welcome', {err, user});
        })
    })
}

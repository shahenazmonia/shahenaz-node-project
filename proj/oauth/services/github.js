const qs = require('querystring');
const request = require('request');

module.exports = {
    fetchToken: (code, callback) => {
        request.post({
            url: 'https://github.com/login/oauth/access_token',
            form: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: code,
            }
        }, (err, res, body) => {
            body = qs.parse(body);
            const access_token = body.access_token;
            const scope = body.scope;
            const token_type = body.token_type;
            callback(access_token);
        });
    },
    getResource: (resource, access_token, callback) => {
        request.get({
            url: 'https://api.github.com/' + resource + '?access_token=' + access_token,
            headers: { 'User-Agent': 'request' },
        }, (err, res, body) => callback(err, JSON.parse(body)));
    }
}

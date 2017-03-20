var routes = require('./routes.js');
var Hapi = require('hapi');
var server = new Hapi.Server();
var env = require('env2')
env('config.env');
// https://github.com/nelsonic/learn-hapi
var hapiAuthJWT = require('hapi-auth-jwt2'); // http://git.io/vT5dZ
var JWT = require('jsonwebtoken'); // used to sign our content
var port = process.env.PORT || 8000; // allow port to be set
var aguid = require('aguid') // https://github.com/ideaq/aguid
// var redis       = require('redis'); // https://github.com/docdis/learn-redis
var url = require('url'); // node core!
var assert = require('assert');
server.connection({port:8000})
var cookie_options = {
    ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
    encoding: 'none', // we already used JWT to encode
    isSecure: false, // warm & fuzzy feelings
    isHttpOnly: true, // prevent client alteration
    clearInvalid: false, // remove invalid cookies
    strictHeader: true, // don't allow violations of RFC 6265
    path: '/' // set the cookie for all routes
}


// bring your own validation function
var validate = function(decoded, request, callback) {
    console.log(" - - - - - - - DECODED token:");
    console.log(decoded);
    // do your checks to see if the session is valid
    // request.redis.get(decoded.id, function(rediserror, reply) {
    //
    //     console.log(' - - - - - - - REDIS reply - - - - - - - ', reply);
    //     var session;
    //     if (reply) {
    //         session = JSON.parse(reply);
    //     } else { // unable to find session in redis ... reply is null
    //         return callback(rediserror, false);
    //     }
    //
    //     if (session.valid === true) {
    //         console.log('I\'m here');
    //         return callback(rediserror, true);
    //     } else {
    //         return callback(rediserror, false);
    //     }
    // });
};


server.register([hapiAuthJWT, require('inert'),require('vision')
    // no options required
], function(err) {
    assert(!err); // halt if error
    // see: http://hapijs.com/api#serverauthschemename-scheme
    server.auth.strategy('jwt', 'jwt', true, {
        key: process.env.JWT_SECRET,
        validateFunc: validate,
        verifyOptions: {
            ignoreExpiration: true,
            algorithms: ['HS256']
        }
    });

    server.route(routes);
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'views'
    });

});
    server.start(() =>{ console.log('Now Visit: http://127.0.0.1:' + port);

});

const qs = require('querystring');
const connection = require('./services/database/dbconnect.js');
const select = require('./services/database/dbselect.js');
const insert = require('./services/database/dbinsert.js');
const welcome = require('./handlers/welcome');
const validate = require('./services/validate.js');




const client = connection();
module.exports = [
{
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
},

{
    method: 'GET',
    path: '/login',
    handler: (req, reply) => {
        const query = qs.stringify({
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.BASE_URL + '/welcome',
            scope: 'user',
        });
        reply.redirect('https://github.com/login/oauth/authorize?' + query);
    }
}, {
    method: 'GET',
    path: '/welcome',
    handler: welcome,
}, {
    method: 'GET',
    path: '/home',
    handler: function(req, reply) {
        select(client,1, (err, res) => {
            if (err) {
                throw err;
            }
            console.log('res', res);
        })
        reply.view('home', {
            date: "thursday",
            time: "11:11"
        })

    },
},{
        method: "GET",
        path: "/",
        config:{
          auth:false
        },
        handler: function(request, reply) {
            reply.view('login');
        }
    },
    {
            method: "POST",
            path: "/signup",
            config: {
              auth:false,
              validate: {
                payload: validate.signup
              }
            },
            handler: function(request, reply) {
              var users =[];
              users.push(request.payload.username);
              users.push(request.payload.password);
              insert(client,users,function (err,result) {
                console.log(result);
              })
                reply('welcome');
            }
        },
    {
        method: ['GET', 'POST'],
        path: '/restricted',
        config: {
            auth: 'jwt'
        },
        handler: function(request, reply) {
            return reply({
                text: 'You used a Token!'
            });
        }
    }
    // { // implement your own login/auth function here
    //     method: ['GET', 'POST'],
    //     path: "/auth",
    //     config: {
    //         auth: false
    //     },
    //     handler: function(request, reply) {
    //         var session = {
    //             valid: true, // this will be set to false when the person logs out
    //             id: aguid(), // a random session id
    //             exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
    //         }
    //         // create the session in Redis
    //         request.redis.set(session.id, JSON.stringify(session));
    //         // sign the session as a JWT
    //         var token = JWT.sign(session, process.env.JWT_SECRET); // synchronous
    //         console.log(token);
    //         reply({
    //                 text: 'Check Browser Cookie or Auth Header for your Token (JWT)'
    //             })
    //             .header("Authorization", token)
    //             .state("token", token, cookie_options)
    //     }
    // },
    // {
    //     method: ['GET', 'POST'],
    //     path: "/logout",
    //     config: {
    //         auth: 'jwt'
    //     },
    //     handler: function(request, reply) {
    //         // implement your own login/auth function here
    //         var session;
    //         select(client,id,function (err,result) {
    //
    //             session = JSON.parse(result)
    //             console.log(' - - - - - - SESSION - - - - - - - -')
    //             console.log(session);
    //             // update the session to no longer valid:
    //             session.value = false;
    //             session.ended = new Date().getTime();
    //             // create the session in Redis
    //             // request.redis.set(session.id, JSON.stringify(session));
    //
    //             return reply({
    //                     text: 'You have been logged out'
    //                 })
    //                 .unstate('token', cookie_options);
    //         })
    //     }
    // }
  ]

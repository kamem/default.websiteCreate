/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var app = express();
var settings = require('./settings');
var post = require('./routes/post');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var csrf = require('csurf');
var db = require('./models/db');
var mongo = require('mongoose');
//middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// csrf対策
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: false, secret: '929nfwamicl' }));
app.use(csrf());
app.use(function (req, res, next) {
    res.locals.csrftoken = req.csrfToken();
    next();
});
app.use(logger('dev'));
//template
app.get('/*', post.template);
//error
app.use(function (err, req, res, next) {
    res.send(err.message);
});
app.listen(settings.port);
console.log('server starting...');

/// <reference path="../typings/tsd.d.ts" />
var settings = require('../settings');
var mongo = require('mongoose');
var db = require('../models/db');
function template(req, res) {
    res.render('posts/' + req.path.slice(1), { title: settings.title });
}
exports.template = template;

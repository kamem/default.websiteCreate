/// <reference path="../typings/tsd.d.ts" />

import settings = require('../settings');
var mongo = require('mongoose');
var db = require('../models/db');
import cloverBlueDb = require('../db');

export function template(req, res) {
	res.render('posts/' + req.path.slice(1), {title : settings.title});
}
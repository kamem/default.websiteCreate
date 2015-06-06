/// <reference path="../typings/tsd.d.ts" />

import settings = require('../settings');

export function error(req, res){
	res.status(404);
	res.render('error', {title: settings.title, errorMessage: "お探しのページは存在しません。"});
}

export function logErrors(err, req, res, next) {
	console.error(err.stack);
	next(err);
}

export function clientErrorHandler(err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({ error: 'system error!' });
	} else {
		next(err);
	}
}

export function errorHandler(err, req, res, next) {
	res.status(404);
	res.render('error', {title: settings.title, errorMessage: "お探しのページは存在しません。"});
}
/// <reference path="../typings/tsd.d.ts" />
var settings = require('../settings');
function error(req, res) {
    res.status(404);
    res.render('error', { title: settings.title, errorMessage: "お探しのページは存在しません。" });
}
exports.error = error;
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
exports.logErrors = logErrors;
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'system error!' });
    }
    else {
        next(err);
    }
}
exports.clientErrorHandler = clientErrorHandler;
function errorHandler(err, req, res, next) {
    res.status(404);
    res.render('error', { title: settings.title, errorMessage: "お探しのページは存在しません。" });
}
exports.errorHandler = errorHandler;

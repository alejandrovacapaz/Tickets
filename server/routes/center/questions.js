var express = require('express');
var questions = require('../../business/center/questions');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/create', common.isAuthenticate, function (request, response) {
    questions.new(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.post('/update', common.isAuthenticate, function (request, response) {
    questions.update(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    questions.init(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    })
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    questions.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    questions.remove(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_DELETE);
    });
});

module.exports = router;
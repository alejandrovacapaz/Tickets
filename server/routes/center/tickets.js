var express = require('express');
var tickets = require('../../business/center/tickets');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/create', common.isAuthenticate, function (request, response) {
    tickets.new(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.get('/', common.isAuthenticate, function (request, response) {
    tickets.init(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    })
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    tickets.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    tickets.remove(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_DELETE);
    });
});

router.post('/notificate', common.isAuthenticate, function (request, response) {
    tickets.notificate(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE_NOTIFICATION);
    });
});

module.exports = router;
var express = require('express');
var cylinders = require('../../business/center/cylinders');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/create', common.isAuthenticate, function (request, response) {
    cylinders.new(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.post('/update', common.isAuthenticate, function (request, response) {
    cylinders.update(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    cylinders.init(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    })
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    cylinders.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    cylinders.remove(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_DELETE);
    });
});

module.exports = router;
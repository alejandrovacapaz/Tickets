var express = require('express');
var workOrders = require('../../business/center/workOrders');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/createManyOrders', common.isAuthenticate, function (request, response) {
    workOrders.newManyOrders(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.post('/create', common.isAuthenticate, function (request, response) {
    workOrders.new(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.post('/update', common.isAuthenticate, function (request, response) {
    workOrders.update(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    workOrders.init(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    })
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    workOrders.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/findByCustomer', common.isAuthenticate, function (request, response) {
    workOrders.findByCustomer(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    workOrders.remove(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_DELETE);
    });
});

module.exports = router;
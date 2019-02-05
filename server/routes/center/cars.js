var express = require('express');
var cars = require('../../business/center/cars');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/create', common.isAuthenticate, function (request, response) {
    cars.new(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.post('/update', common.isAuthenticate, function (request, response) {
    cars.update(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.post('/updateByNumberPlate', common.isAuthenticate, function (request, response) {
    cars.updateByNumberPlate(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    cars.init(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    })
});

router.post('/forNumberPlate', common.isAuthenticate, function (request, response) {
    cars.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});


router.post('/destroy', common.isAuthenticate, function (request, response) {
    cars.remove(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_DELETE);
    });
});

module.exports = router;
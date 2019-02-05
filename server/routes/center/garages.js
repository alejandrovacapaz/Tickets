var express = require('express');
var garages = require('../../business/center/garages');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/create', common.isAuthenticate, function (request, response) {
    garages.new(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.post('/update', common.isAuthenticate, function (request, response) {
    garages.update(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    garages.init(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    })
});

router.get('/findByPartner', common.isAuthenticate, function (request, response) {
    garages.findOnlyPartner(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    garages.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    garages.remove(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_DELETE);
    });
});

module.exports = router;
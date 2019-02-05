var express = require('express');
var customers = require('../../business/center/customers');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/update', common.isAuthenticate, function (request, response) {
    customers.update(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.post('/updateStatus', common.isAuthenticate, function (request, response) {
    customers.updateStatus(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_UPDATE);
    });
});

router.post('/', common.isAuthenticate, function (request, response) {
    customers.init(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    })
});

router.post('/paginate', common.isAuthenticate, function (request, response) {
    customers.paginate(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/paginateFilter', common.isAuthenticate, function (request, response) {
    customers.paginateFilter(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    customers.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

router.post('/listByCustomer', common.isAuthenticate, function (request, response) {
    customers.listByCustomer(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

module.exports = router;
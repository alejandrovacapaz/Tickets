var express = require('express');
var filterUsers = require('../../business/center/filterUsers');
var common = require('../../utils/common');
var constant = require('../../utils/constants');
var router = express.Router();

router.post('/save', common.isAuthenticate, function (request, response) {
    filterUsers.save(request.body, function (err, data) {
        common.sendResponse(response, err, data, constant.MESSAGE_SAVE);
    })
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    filterUsers.find(request.body, function (err, data) {
        common.sendResponse(response, err, data);
    });
});

module.exports = router;
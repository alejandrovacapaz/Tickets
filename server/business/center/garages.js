var models = require('../../models');
var common = require('../../utils/common');

exports.new = function (data, actionToExecute) {
    models.Garage.create({
        code: data.code,
        license: data.license,
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        mobile: data.mobile,
        email: data.email,
        detail: data.detail,
        isPartner: data.isPartner,
        latitude: data.latitude,
        longitude: data.longitude,
        enabled: data.enabled,
        shortUrlMaps: data.shortUrlMaps
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.update = function (data, actionToExecute) {
    models.Garage.update({
        code: data.code,
        license: data.license,
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        mobile: data.mobile,
        email: data.email,
        detail: data.detail,
        isPartner: data.isPartner,
        latitude: data.latitude,
        longitude: data.longitude,
        enabled: data.enabled,
        shortUrlMaps: data.shortUrlMaps
    }, { where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.init = function (data, actionToExecute) {
    models.Garage.findAll({ order: [['fullName', 'ASC']] }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.findOnlyPartner = function (data, actionToExecute) {
    models.Garage.findAll({ where: { isPartner: true } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.Garage.findOne({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.remove = function (data, actionToExecute) {
    models.Garage.destroy({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}
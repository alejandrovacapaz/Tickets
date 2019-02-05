var models = require('../../models');
var common = require('../../utils/common');
var Sequelize = require("sequelize");

exports.new = function (data, actionToExecute) {
    models.Car.create({
        numberPlate: data.numberPlate,
        make: data.make,
        model: data.model,
        numberEngine: data.numberEngine,
        color: data.color,
        type: data.type,
        annum: data.annum,
        detail: data.detail,
        idCustomer: data.idCustomer,
        codeCustomer: data.codeCustomer
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.update = function (data, actionToExecute) {
    models.Car.update({
        numberPlate: data.numberPlate,
        make: data.make,
        model: data.model,
        numberEngine: data.numberEngine,
        color: data.color,
        type: data.type,
        annum: data.annum,
        detail: data.detail,
        idCustomer: data.idCustomer,
        codeCustomer: data.codeCustomer
    }, { where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.updateByNumberPlate = function (data, actionToExecute) {
    models.Car.update({
        make: data.make,
        model: data.model,
        numberEngine: data.numberEngine,
        color: data.color,
        type: data.type,
        annum: data.annum,
        detail: data.detail
    }, { where: { numberPlate: data.numberPlate } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.init = function (data, actionToExecute) {
    models.Car.findAll().then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.Car.findOne({ where: { numberPlate: data.numberPlate } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.remove = function (data, actionToExecute) {
    models.Car.destroy({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}
var models = require('../../models');
var common = require('../../utils/common');

exports.new = function (data, actionToExecute) {
    models.Cylinder.create({
        code: data.code,
        license: data.license,
        marke: data.marke,
        model: data.model,
        liter: data.liter,
        standard: data.standard,
        diameter: data.diameter,
        density: data.density,
        hardness: data.hardness,
        longitude: data.longitude,
        material: data.material
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.update = function (data, actionToExecute) {
    models.Cylinder.update({
        code: data.code,
        license: data.license,
        marke: data.marke,
        model: data.model,
        liter: data.liter,
        standard: data.standard,
        diameter: data.diameter,
        density: data.density,
        hardness: data.hardness,
        longitude: data.longitude,
        material: data.material
    }, { where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.init = function (data, actionToExecute) {
    models.Cylinder.findAll().then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.Cylinder.findOne({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.remove = function (data, actionToExecute) {
    models.Cylinder.destroy({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}
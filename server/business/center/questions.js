var models = require('../../models');
var common = require('../../utils/common');

exports.new = function (data, actionToExecute) {
    models.Question.create({
        title: data.title,
        type: data.type,
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.update = function (data, actionToExecute) {
    models.Question.update({
        title: data.title,
        type: data.type,
    }, { where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.init = function (data, actionToExecute) {
    models.Question.findAll().then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.Question.findOne({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.remove = function (data, actionToExecute) {
    models.Question.destroy({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}
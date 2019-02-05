var models = require('../../models');
var common = require('../../utils/common');
var Sequelize = require('sequelize');

exports.init = function (data, actionToExecute) {
    models.Customer.findAll().then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.Customer.findOne({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.update = function (data, actionToExecute) {
    models.Customer.update({
        numberId: data.numberId,
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        cellPhone: data.cellPhone,
        email: data.email,
        zone: data.zone,
        birthdate: data.birthdate,
        detail: data.detail
    }, { where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.updateStatus = function (data, actionToExecute) {
    models.Customer.update({
        statusTicket: data.status,
    }, { where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.listByCustomer = function (data, actionToExecute) {
    models.Customer.findOne({ where: { id: data.idCustomer } }).then(function (resCustomer) {
        models.WorkOrder.findAll({
            include: [
                { model: models.Car, required: false, attributes: ["make", "model", "color", "type", "annum", "numberPlate"] },
                { model: models.Garage, required: false, attributes: ["fullName", "isPartner", "enabled"] }
            ],
            where: {
                idCustomer: data.idCustomer, statusTicket: "Pendiente",
                status: { notIn: ["ANULADA"] }
            },
            order: [["expireDate", "ASC"]]
        }).then(function (resOrders) {
            models.Ticket.findAll({ where: { idCustomer: data.idCustomer }, order: [['dateRegister', 'DESC']] }).then(function (resTickets) {
                models.Garage.findAll({
                    attributes: ["fullName", "isPartner", "id", "phone", "latitude", "longitude", "shortUrlMaps", "mobile", "email"],
                    where: { enabled: "Habilitado" },
                    order: [["fullName", "ASC"]]
                }).then(function (resGarages) {
                    models.Question.findAll({ where: { type: "Llamada" } }).then(function (resQuestions) {
                        var result = {
                            custumerData: resCustomer, listOrders: resOrders,
                            listQuestions: resQuestions, listTickets: resTickets,
                            listGarages: resGarages
                        };
                        actionToExecute(null, result);
                    });
                });
            });
        });
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}
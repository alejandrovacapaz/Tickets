var models = require('../../models');
var common = require('../../utils/common');
var notifier = require('../../utils/notification');
var constants = require('../../utils/constants');

function newTicket(data) {
    return {
        dateRegister: data.dateRegister,
        type: data.type,
        detail: data.detail,
        status: data.status,
        codeCylinder: data.codeCylinder,
        numberPlate: data.numberPlate,
        rate: data.rate,
        garageNew: data.garageNew,
        orderBy: data.orderBy,
        dateReprogram: data.dateReprogram,
        idCustomer: data.idCustomer,
        idCar: data.idCar,
        idGasCylinder: data.idGasCylinder,
        idGarage: data.idGarage,
        idWorkOrder: data.idWorkOrder,
        idUser: data.idUser
    };
}

function newNotice(data) {
    return {
        dateRegister: data.dateRegister,
        detail: data.detail,
        status: 'Pendiente',
        idCustomer: data.idCustomer,
        idGarage: data.idGarage
    };
}

exports.new = function (data, actionToExecute) {
    var idCustomer = data.details[0].idCustomer;
    return models.sequelize.transaction(function (t) {
        return models.Customer.update({ dateReprogram: data.details[0].dateReprogram, statusTicket: data.statusCustomer },
            { where: { id: idCustomer } }, { transaction: t }).then(function () {
                var promises = [];
                for (var index = 0; index < data.details.length; index++) {
                    var detailPromise = models.Ticket.create(newTicket(data.details[index]));
                    promises.push(detailPromise, { transaction: t });
                }
                return Promise.all(promises).then(function () {
                    var workOrderPromises = [];
                    for (var index = 0; index < data.details.length; index++) {
                        var workOrderPromise = models.WorkOrder.update({
                            statusTicket: data.statusCustomer
                        }, { where: { id: data.details[index].idWorkOrder } });
                        workOrderPromises.push(workOrderPromise, { transaction: t });
                    }
                    return Promise.all(workOrderPromises).then(function () {
                        var carPromises = [];
                        if (data.dataCar) {
                            var carPromise = models.Car.create({
                                numberPlate: data.dataCar.numberPlate,
                                idCustomer: data.dataCar.idCustomer,
                                codeCustomer: data.dataCar.codeCustomer
                            });
                            carPromises.push(carPromise, { transaction: t });
                        }
                        return Promise.all(carPromises).then(function () {
                            var noticePromises = [];
                            if (data.details[0].sendMail) {
                                return models.Notice.create(newNotice(data.details[0]), { transaction: t });
                            }
                        });
                    });
                });
            });
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.init = function (data, actionToExecute) {
    models.Ticket.findAll().then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.Ticket.findAll({ where: { idCustomer: data.idCustomer } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.remove = function (data, actionToExecute) {
    models.Ticket.destroy({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.notificate = function (data, actionToExecute) {
    data.html = processEmailTemplate(data);

    notifier.notificate(data, function (err, data) {
        actionToExecute(err, data);
    });
}

function processEmailTemplate(data) {
    var template = constants.EMAIL_TEMPLATE;
    template = template.replace('{client}', data.client);
    template = template.replace('{cellPhone}', data.cellPhone);
    template = template.replace('{garage}', data.garage);
    template = template.replace('{carData}', data.carData);
    return template;
}
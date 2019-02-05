var models = require('../../models');
var common = require('../../utils/common');

function newOrder(data) {
    return {
        lastDate: data.lastDate,
        code: data.code,
        customer: data.customer,
        status: data.status,
        idCustomer: data.idCustomer,
        expireDate: data.expireDate,
        codeCylinder: data.codeCylinder,
        numberPlate: data.numberPlate,
        typeOrder: data.typeOrder,
        statusTicket: data.statusTicket,
        idCar: data.idCar,
        idGasCylinder: data.idGasCylinder,
        idGarage: data.idGarage,
        idCodeCard: data.idCodeCard
    };
}

exports.newManyOrders = function (data, actionToExecute) {
    return models.sequelize.transaction(function (t) {
        var promises = [];
        for (var index = 0; index < data.details.length; index++) {
            var detailPromise = models.WorkOrder.create(newOrder(data.details[index]));
            promises.push(detailPromise, { transaction: t });
        }
        return Promise.all(promises).then(function () {
        });
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.new = function (data, actionToExecute) {
    models.WorkOrder.create({
        lastDate: data.lastDate,
        code: data.code,
        customer: data.customer,
        status: data.status,
        idCustomer: data.idCustomer,
        expireDate: data.expireDate,
        codeCylinder: data.codeCylinder,
        numberPlate: data.numberPlate,
        typeOrder: data.typeOrder,
        statusTicket: data.statusTicket,
        idCar: data.idCar,
        idGasCylinder: data.idGasCylinder,
        idGarage: data.idGarage,
        idCodeCard: data.idCodeCard
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.update = function (data, actionToExecute) {
    models.WorkOrder.update({
        lastDate: data.lastDate,
        customer: data.customer,
        status: data.status,
        idCustomer: data.idCustomer,
        expireDate: data.expireDate,
        codeCylinder: data.codeCylinder,
        numberPlate: data.numberPlate,
        typeOrder: data.typeOrder,
        statusTicket: data.statusTicket,
        idCar: data.idCar,
        idGasCylinder: data.idGasCylinder,
        idGarage: data.idGarage,
        idCodeCard: data.idCodeCard
    }, { where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.init = function (data, actionToExecute) {
    models.WorkOrder.findAll().then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.WorkOrder.findAll({
        include: [{ model: models.Car, required: false }],
        where: { idCustomer: data.idCustomer }
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.findByCustomer = function (data, actionToExecute) {
    models.WorkOrder.findAll({
        include: [{ model: models.Car, required: false, attributes: ["make", "model", "color", "type", "annum", "numberPlate"] },
        { model: models.Garage, required: false, attributes: ["fullName", "isPartner"] }],
        where: {
            idCustomer: data.idCustomer, statusTicket: "Pendiente",
            status: { in: ["Cancelado"] }
        }
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.remove = function (data, actionToExecute) {
    models.WorkOrder.destroy({ where: { id: data.id } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}
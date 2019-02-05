var models = require('../../models');
var common = require('../../utils/common');


exports.save = function (data, actionToExecute) {

    return models.sequelize.transaction(function (t) {
        return models.FilterUser.findOne({ where: { idUser: data.idUser } }, { transaction: t }).then(function (filter) {
            if (!filter) {
                return models.FilterUser.create({
                    typeRange: data.typeRange,
                    minRangeExpire: data.minRangeExpire,
                    maxRangeExpire: data.maxRangeExpire,
                    minRangeCountCylinder: data.minRangeCountCylinder,
                    maxRangeCountCylinder: data.maxRangeCountCylinder,
                    search: data.search,
                    typeMemberFilter: data.typeMemberFilter,
                    pageSize: data.pageSize,
                    orderList: data.orderList,
                    onlyReprogram: data.onlyReprogram,
                    idUser: data.idUser,
                }, { transaction: t });
            }
            else {
                return models.FilterUser.update({
                    typeRange: data.typeRange,
                    minRangeExpire: data.minRangeExpire,
                    maxRangeExpire: data.maxRangeExpire,
                    minRangeCountCylinder: data.minRangeCountCylinder,
                    maxRangeCountCylinder: data.maxRangeCountCylinder,
                    search: data.search,
                    typeMemberFilter: data.typeMemberFilter,
                    pageSize: data.pageSize,
                    orderList: data.orderList,
                    onlyReprogram: data.onlyReprogram,
                }, { where: { idUser: data.idUser } }, { transaction: t });
            }
        });
    }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}

exports.find = function (data, actionToExecute) {
    models.FilterUser.findOne({ where: { idUser: data.idUser } }).then(function (res) {
        actionToExecute(null, res);
    }).catch(function (err) {
        actionToExecute(err, null);
    });
}
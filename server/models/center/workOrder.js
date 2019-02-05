"use strict";

var moment = require("moment");
var common = require('../../utils/common');

module.exports = function (sequelize, DataTypes) {
    var WorkOrder = sequelize.define("WorkOrder", {
        code: { type: DataTypes.STRING, allowNull: false, unique: true },
        lastDate: {
            type: DataTypes.DATE, allowNull: false,
            set: function (val) {
                this.setDataValue('lastDate', common.formatDate(val));
            },
            get: function (val) {
                var date = this.getDataValue('lastDate');
                return moment.tz(date, 'America/La_Paz').format("DD/MM/YYYY");
            }
        },
        expireDate: { type: DataTypes.INTEGER, allowNull: true },
        customer: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: true },
        codeCylinder: { type: DataTypes.STRING, allowNull: true },
        codeCard: { type: DataTypes.STRING, allowNull: true },
        codeGarage: { type: DataTypes.STRING, allowNull: true },
        numberPlate: { type: DataTypes.STRING, allowNull: true },
        typeOrder: { type: DataTypes.STRING, allowNull: false },
        statusTicket: { type: DataTypes.STRING, allowNull: true }
    }, {
            classMethods: {
                associate: function (models) {
                    WorkOrder.belongsTo(models.Customer, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
                    WorkOrder.belongsTo(models.Car, { foreignKey: { name: 'idCar', allowNull: true }, onDelete: 'restrict' });
                    WorkOrder.belongsTo(models.GasCylinder, { foreignKey: { name: 'idGasCylinder', allowNull: true }, onDelete: 'restrict' });
                    WorkOrder.belongsTo(models.Garage, { foreignKey: { name: 'idGarage', allowNull: true }, onDelete: 'restrict' });
                    WorkOrder.belongsTo(models.CodeCard, { foreignKey: { name: 'idCodeCard', allowNull: true }, onDelete: 'restrict' });
                    WorkOrder.hasMany(models.Ticket, { foreignKey: { name: 'idWorkOrder', allowNull: true }, onDelete: 'restrict' });
                }
            }
        });
    return WorkOrder;
};
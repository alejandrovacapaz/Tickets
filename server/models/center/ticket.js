"use strict";

var moment = require("moment");
var common = require('../../utils/common');

module.exports = function (sequelize, DataTypes) {
    var Ticket = sequelize.define("Ticket", {
        dateRegister: {
            type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.NOW,
            set: function (val) {
                this.setDataValue('dateRegister', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
            },
            get: function (val) {
                var date = this.getDataValue('dateRegister');
                return moment.tz(date, 'America/La_Paz').format("DD/MM/YYYY HH:mm:ss");
            }
        },
        detail: { type: DataTypes.STRING, allowNull: true },
        type: { type: DataTypes.INTEGER, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: true },
        codeCylinder: { type: DataTypes.STRING, allowNull: true },
        numberPlate: { type: DataTypes.STRING, allowNull: true },
        rate: { type: DataTypes.STRING, allowNull: true },
        garageNew: { type: DataTypes.INTEGER, allowNull: true },
        orderBy: { type: DataTypes.INTEGER, allowNull: true },
        dateReprogram: {
            type: DataTypes.DATE, allowNull: true,
            set: function (val) {
                if (val) {
                    this.setDataValue('dateReprogram', common.formatDate(val));
                } else {
                    this.setDataValue('dateReprogram', null);
                }
            },
            get: function (val) {
                var date = this.getDataValue('dateReprogram');
                return moment(date).format("DD/MM/YYYY");
            }
        },
    }, {
            classMethods: {
                associate: function (models) {
                    Ticket.belongsTo(models.Customer, { foreignKey: { name: 'idCustomer', allowNull: false }, onDelete: 'restrict' });
                    Ticket.belongsTo(models.Car, { foreignKey: { name: 'idCar', allowNull: true }, onDelete: 'restrict' });
                    Ticket.belongsTo(models.GasCylinder, { foreignKey: { name: 'idGasCylinder', allowNull: true }, onDelete: 'restrict' });
                    Ticket.belongsTo(models.Garage, { foreignKey: { name: 'idGarage', allowNull: true }, onDelete: 'restrict' });
                    Ticket.belongsTo(models.WorkOrder, { foreignKey: { name: 'idWorkOrder', allowNull: true }, onDelete: 'restrict' });
                    Ticket.belongsTo(models.User, { foreignKey: { name: 'idUser', allowNull: true }, onDelete: 'restrict' });
                }
            }
        });
    return Ticket;
};
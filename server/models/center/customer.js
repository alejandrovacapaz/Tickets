"use strict";
var moment = require("moment");
var common = require('../../utils/common');

module.exports = function (sequelize, DataTypes) {
  var Customer = sequelize.define("Customer", {
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    numberId: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    cellPhone: { type: DataTypes.STRING, allowNull: true },
    mobile: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    zone: { type: DataTypes.STRING, allowNull: true },
    detail: { type: DataTypes.STRING, allowNull: true },
    maxCylinder: { type: DataTypes.INTEGER, allowNull: true },
    expireDate: { type: DataTypes.INTEGER, allowNull: true },
    birthdate: {
      type: DataTypes.DATE, allowNull: true,
      set: function (val) {
        if (val != null) {
          this.setDataValue('birthdate', common.formatDate(val));
        }
        else {
          this.setDataValue('birthdate', null);
        }
      },
      get: function (val) {
        var date = this.getDataValue('birthdate');
        if (date != null) {
          return moment(date).format("DD/MM/YYYY");
        } else {
          return date;
        }
      }
    },
    lastDate: {
      type: DataTypes.DATE, allowNull: true,
      set: function (val) {
        this.setDataValue('lastDate', common.formatDate(val));
      },
      get: function (val) {
        var date = this.getDataValue('lastDate');
        return moment(date).format("DD/MM/YYYY");
      }
    },
    dateReprogram: {
      type: DataTypes.DATE, allowNull: true,
      set: function (val) {
        if (val) {
          this.setDataValue('dateReprogram', common.formatDate(val));
        }
        else {
          this.setDataValue('dateReprogram', null);
        }
      },
      get: function (val) {
        var date = this.getDataValue('dateReprogram');
        return moment(date).format("DD/MM/YYYY");
      }
    },
    isMember: { type: DataTypes.BOOLEAN, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
    statusTicket: { type: DataTypes.STRING, allowNull: true },
  }, {
      classMethods: {
        associate: function (models) {
          Customer.hasMany(models.Ticket, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
          Customer.hasMany(models.WorkOrder, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
          Customer.hasMany(models.GasCylinder, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
          Customer.hasMany(models.Car, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
          Customer.hasMany(models.Notice, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
          Customer.hasMany(models.CodeCard, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
        }
      }
    });
  return Customer;
};
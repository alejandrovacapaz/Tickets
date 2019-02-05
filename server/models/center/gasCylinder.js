"use strict";

module.exports = function (sequelize, DataTypes) {
  var GasCylinder = sequelize.define("GasCylinder", {
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    serie: { type: DataTypes.STRING, allowNull: true },
    orderNumber: { type: DataTypes.STRING, allowNull: true },
    customer: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
  }, {
      classMethods: {
        associate: function (models) {
          GasCylinder.hasMany(models.Ticket, { foreignKey: { name: 'idGasCylinder', allowNull: false }, onDelete: 'restrict' });
          GasCylinder.hasMany(models.WorkOrder, { foreignKey: { name: 'idGasCylinder', allowNull: true }, onDelete: 'restrict' });
          GasCylinder.belongsTo(models.Customer, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
          GasCylinder.belongsTo(models.CylinderSerie, { foreignKey: { name: 'idSerie', allowNull: true }, onDelete: 'restrict' });
        }
      }
    });
  return GasCylinder;
};
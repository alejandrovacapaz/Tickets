"use strict";

module.exports = function (sequelize, DataTypes) {
    var Car = sequelize.define("Car", {
        numberPlate: { type: DataTypes.STRING, allowNull: false, unique: true },
        make: { type: DataTypes.STRING, allowNull: true },
        model: { type: DataTypes.STRING, allowNull: true },
        numberEngine: { type: DataTypes.STRING, allowNull: true },
        color: { type: DataTypes.STRING, allowNull: true },
        type: { type: DataTypes.STRING, allowNull: true },
        annum: { type: DataTypes.STRING, allowNull: true },
        detail: { type: DataTypes.STRING, allowNull: true },   
        codeCustomer: { type: DataTypes.STRING, allowNull: true }    
     }, {
      classMethods: {
        associate: function (models) {
          Car.belongsTo(models.Customer, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
          Car.hasMany(models.Ticket, { foreignKey: { name: 'idCar', allowNull: true }, onDelete: 'restrict' });
          Car.hasMany(models.WorkOrder, { foreignKey: { name: 'idCar', allowNull: true }, onDelete: 'restrict' });
          Car.hasMany(models.CodeCard, { foreignKey: { name: 'idCar', allowNull: true }, onDelete: 'restrict' });
        }
      }
    });
    return Car;
};
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Garage = sequelize.define("Garage", {
        code: { type: DataTypes.STRING, allowNull: true, unique: true },
        license: { type: DataTypes.STRING, allowNull: true },
        fullName: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        mobile: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: true },
        detail: { type: DataTypes.STRING, allowNull: true },
        isPartner: { type: DataTypes.BOOLEAN, allowNull: false },
        enabled: { type: DataTypes.STRING, allowNull: true },
        latitude: { type: DataTypes.DECIMAL(18, 16), allowNull: true },
        longitude: { type: DataTypes.DECIMAL(18, 16), allowNull: true },
        shortUrlMaps: { type: DataTypes.STRING, allowNull: true },
    }, {
            classMethods: {
                associate: function (models) {
                    Garage.hasMany(models.Ticket, { foreignKey: { name: 'idGarage', allowNull: true }, onDelete: 'restrict' });
                    Garage.hasMany(models.WorkOrder, { foreignKey: { name: 'idGarage', allowNull: true }, onDelete: 'restrict' });
                    Garage.hasMany(models.User, { foreignKey: { name: 'idGarage', allowNull: true }, onDelete: 'restrict' });
                    Garage.hasMany(models.Notice, { foreignKey: { name: 'idGarage', allowNull: true }, onDelete: 'restrict' });
                }
            }
        });
    return Garage;
};
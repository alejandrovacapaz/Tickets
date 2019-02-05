"use strict";

module.exports = function (sequelize, DataTypes) {
    var FilterUser = sequelize.define("FilterUser", {
        typeRange: { type: DataTypes.STRING, allowNull: true },
        minRangeExpire: { type: DataTypes.STRING, allowNull: true },
        maxRangeExpire: { type: DataTypes.STRING, allowNull: true },
        minRangeCountCylinder: { type: DataTypes.STRING, allowNull: true },
        maxRangeCountCylinder: { type: DataTypes.STRING, allowNull: true },
        search: { type: DataTypes.STRING, allowNull: true },
        typeMemberFilter: { type: DataTypes.INTEGER, allowNull: true },
        pageSize: { type: DataTypes.INTEGER, allowNull: true },
        orderList: { type: DataTypes.INTEGER, allowNull: true },
        onlyReprogram: { type: DataTypes.BOOLEAN, allowNull: true }
    }, {
            classMethods: {
                associate: function (models) {
                    FilterUser.belongsTo(models.User, { foreignKey: { name: 'idUser', allowNull: true }, onDelete: 'restrict' });
                }
            }
        });
    return FilterUser;
};
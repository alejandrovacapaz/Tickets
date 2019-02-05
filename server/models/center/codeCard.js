"use strict";

module.exports = function (sequelize, DataTypes) {
    var CodeCard = sequelize.define("CodeCard", {
        code: { type: DataTypes.STRING, allowNull: false, unique: true },
        numberPlate: { type: DataTypes.STRING, allowNull: true },
        detail: { type: DataTypes.STRING, allowNull: true },
        customer: { type: DataTypes.STRING, allowNull: true },
        garage: { type: DataTypes.STRING, allowNull: true },
        codeGovernment: { type: DataTypes.STRING, allowNull: true },
        transport: { type: DataTypes.STRING, allowNull: true },
        dateRegister: {
            type: DataTypes.DATE, allowNull: true,
            set: function (val) {
                this.setDataValue('dateRegister', common.formatDate(val));
            },
            get: function (val) {
                var date = this.getDataValue('dateRegister');
                return moment(date).format("DD/MM/YYYY");
            }
        },
    }, {
            classMethods: {
                associate: function (models) {
                    CodeCard.belongsTo(models.Customer, { foreignKey: { name: 'idCustomer', allowNull: true }, onDelete: 'restrict' });
                    CodeCard.belongsTo(models.Garage, { foreignKey: { name: 'idGarage', allowNull: true }, onDelete: 'restrict' });
                    CodeCard.belongsTo(models.Car, { foreignKey: { name: 'idCar', allowNull: true }, onDelete: 'restrict' });
                    CodeCard.hasMany(models.WorkOrder, { foreignKey: { name: 'idCodeCard', allowNull: true }, onDelete: 'restrict' });
                }
            }
        });
    return CodeCard;
};
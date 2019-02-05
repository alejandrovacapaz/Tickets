"use strict";

module.exports = function (sequelize, DataTypes) {
    var CylinderSerie = sequelize.define("CylinderSerie", {
        code: { type: DataTypes.STRING, allowNull: false, unique: true },
        license: { type: DataTypes.STRING, allowNull: false },
        marke: { type: DataTypes.STRING, allowNull: false },
        model: { type: DataTypes.STRING, allowNull: false },
        liter: { type: DataTypes.STRING, allowNull: false },
        standard: { type: DataTypes.STRING, allowNull: false },
        diameter: { type: DataTypes.STRING, allowNull: true },
        density: { type: DataTypes.STRING, allowNull: true },
        hardness: { type: DataTypes.STRING, allowNull: true },
        longitude: { type: DataTypes.STRING, allowNull: true },        
        material: { type: DataTypes.STRING, allowNull: true },        
    }, {
      classMethods: {
        associate: function (models) {
          CylinderSerie.hasMany(models.GasCylinder, { foreignKey: { name: 'idSerie', allowNull: true }, onDelete: 'restrict' });
        }
      }
    });
    return CylinderSerie;
};
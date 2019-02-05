"use strict";

module.exports = function (sequelize, DataTypes) {
  var Question = sequelize.define("Question", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.STRING, allowNull: false },
    nextNumber: { type: DataTypes.INTEGER, allowNull: true },
    pathTemplate: { type: DataTypes.STRING, allowNull: true },
    yesAction: { type: DataTypes.BOOLEAN, allowNull: true },
    noAction: { type: DataTypes.BOOLEAN, allowNull: true }
  });
  return Question;
};
"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = 'production';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};

function fileList(dir) {
  return fs.readdirSync(dir).reduce(function (list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [{ folder: name, file: file }]);

  }, []);
}


function initializeModels() {
  var files = fileList(__dirname);
  for (var i = 0; i < files.length; i++) {
    if (files[i].file != "index.js") {
      var model = sequelize.import(files[i].folder);
      db[model.name] = model;
    }
  }
}


initializeModels();


Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

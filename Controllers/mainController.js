const Model = require('../Models/mainModel');
const factory = require("./handleFactory");



exports.getDatabases = factory.getAll(Model, {});
exports.addDatabase = factory.addOne(Model, { createDb: true });
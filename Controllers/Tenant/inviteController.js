const connectModel = require('../../Models/Tenant/inviteModel');
const connectModelSpaces = require('../../Models/Tenant/spacesModel');
const connectModeltopics = require('../../Models/Tenant/topicsModel');
const factory = require("./handleFactory");


exports.getAll = factory.getAll(connectModel, { checkType: true, types: ['space', 'topic'] });

exports.addInvite = factory.addOne(connectModel, {
    checkSpace: true, connectModelSpaces, checkTopic: true, connectModeltopics
});
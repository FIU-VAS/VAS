'use strict'
const mongoose = require('mongoose');
const db = require("../services/db.js").default;
const config = require("../config/config.js").default;
const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`;
import SchoolPersonnel from "../models/Users/school_User";

module.exports.up = async function (next) {
    await db.connect(dbUri);

    const vasDb = mongoose.connection.client.db("vas");
    const teamCollection = vasDb.collection("teams");

    const teams = await teamCollection.find({}).toArray()
    for (let team of teams)  {
        if (team.schoolPersonnel && team.schoolPersonnel.length) {
            return true;
        }

        const teamPersonnel = await SchoolPersonnel.findOne({schoolCode: team.schoolCode});

        if (!teamPersonnel) {
            return true
        }

        teamCollection.updateOne({_id: team._id}, {$set: {schoolPersonnel: [teamPersonnel.email]}})
    }

    next()
}

module.exports.down = async function (next) {
    await db.connect(dbUri);

    const vasDb = mongoose.connection.client.db("vas");
    const teamCollection = vasDb.collection("teams");

    await teamCollection.updateMany({}, {$unset: {schoolPersonnel: ""}});

    next()
}

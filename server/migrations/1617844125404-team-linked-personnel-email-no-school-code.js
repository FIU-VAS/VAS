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

    const personnel = await SchoolPersonnel.find();
    const mappedPersonnel = personnel.map(person => ({
        [person.schoolCode]: person
    })).reduce((acc, obj) => Object.assign({}, acc, obj));

    const teams = await teamCollection.find({}).toArray();

    for (let team of teams)  {
        if (team.schoolPersonnel && team.schoolPersonnel.length) {
            return true;
        }

        if (!(team.schoolCode in mappedPersonnel)) {
            continue
        }

        await teamCollection.updateOne({_id: team._id}, {$set: {schoolPersonnel: [mappedPersonnel[team.schoolCode].email]}})
    }
    await mongoose.connection.close();
    next()
}

module.exports.down = async function (next) {
    await db.connect(dbUri);

    const vasDb = mongoose.connection.client.db("vas");
    const teamCollection = vasDb.collection("teams");

    await teamCollection.updateMany({}, {$unset: {schoolPersonnel: ""}});
    await mongoose.connection.close();
    next()
}

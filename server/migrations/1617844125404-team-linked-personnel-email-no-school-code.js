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

    let updates = [];

    const teams = await teamCollection.find({}).toArray()
    for (let team of teams)  {
        if (team.schoolPersonnel && team.schoolPersonnel.length) {
            return true;
        }

        const teamPersonnel = await SchoolPersonnel.findOne({schoolCode: team.schoolCode});

        updates.push({
            updateOne: {
                filter: {
                    _id: team._id,
                },
                update: {
                    $set: {
                        schoolPersonnel: [teamPersonnel.email]
                    }
                }
            }
        })
    }

    if (updates.length) {
        await teamCollection.bulkWrite(updates)
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

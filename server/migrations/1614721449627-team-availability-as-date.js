'use strict'
const mongoose = require('mongoose');
import {parse, setDay, format, addHours} from "date-fns";

const db = require("../services/db.js").default;
const config = require("../config/config.js").default;
const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`;

import {REFERENCE_DATE, Days} from "../models/Teams/team";

const updateSchema = async (collection) => {
  const objs = await collection.find().toArray();
  const days = Object.values(Days);

  let updates = objs.map(obj => {
    if (!obj.availability) return false;


    let toUpdate = {
      availability: obj.availability.map(av => {
        let startTime = setDay(parse(av.startTime, "HH:mm", REFERENCE_DATE), days.indexOf(av.dayOfWeek) + 1);
        let endTime = setDay(parse(av.endTime, "HH:mm", REFERENCE_DATE), days.indexOf(av.dayOfWeek) + 1);

        // Add 5 hours because current date is supposed to be in the eastern timezone
        startTime = addHours(startTime, 5);
        endTime = addHours(endTime, 5);

        return {
          ...av,
          startTime: startTime,
          endTime: endTime
        }
      })
    }

    return {
      updateOne: {
        filter: {
          _id: obj._id,
        },
        update: {
          $set: toUpdate
        }
      }
    }
  }).filter(Boolean)

  if (updates.length) {
    await collection.bulkWrite(updates)
  }
};

const downgradeSchema = async (collection) => {
  const objs = await collection.find().toArray();

  let updates = objs.map(obj => {
    if (!obj.availability) return false;

    let toUpdate = {
      availability: obj.availability.map(av => {
        return {
          ...av,
          startTime: format(av.startTime, "HH:mm"),
          endTime: format(av.endTime, "HH:mm")
        }
      })
    }

    return {
      updateOne: {
        filter: {
          _id: obj._id,
        },
        update: {
          $set: toUpdate
        }
      }
    }
  }).filter(Boolean)

  if (updates.length) {
    await collection.bulkWrite(updates)
  }
}

module.exports.up = async (next) => {
  await db.connect(dbUri)

  const mongoClient = mongoose.connection.client;
  const vasDb = mongoClient.db("vas");

  await updateSchema(vasDb.collection("teams"));
  await updateSchema(vasDb.collection("users"));
  await mongoose.connection.close();
  next()
}

module.exports.down = async function (next) {
  await db.connect(dbUri)

  const mongoClient = mongoose.connection.client;
  const vasDb = mongoClient.db("vas");

  await downgradeSchema(vasDb.collection("teams"));
  await downgradeSchema(vasDb.collection("users"));
  await mongoose.connection.close();
  next()
}

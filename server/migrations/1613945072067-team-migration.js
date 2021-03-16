'use strict'
const mongoose = require('mongoose');
const db = require("../services/db.js").default;
const config = require("../config/config.js").default;
const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`


module.exports.up = async (next) => {
  await db.connect(dbUri)

  const mongoClient = mongoose.connection.client;
  const vasDb = mongoClient.db("vas");
  const teams = vasDb.collection("teams");

  let updates = [];
  await teams.find().forEach(item => {
    let availability = [];
    for (let day in item.dayOfWeek) {
      if (item.dayOfWeek.hasOwnProperty(day) && item.dayOfWeek[day]) {
        let dayAvailability = {
          dayOfWeek: day,
          startTime: item.startTime,
          endTime: item.endTime
        }
        availability.push(dayAvailability);
      }
    }
    let updateOne = {
      filter: {
        _id: item._id,
      },
      update: {
        $set: {
          availability: availability,
        },
        $unset: {
          dayOfWeek: 1,
          startTime: 1,
          endTime: 1
        }
      },
    }
    updates.push({
      updateOne
    });
  });

  if (updates.length) {
    await teams.bulkWrite(updates)
  }

  mongoose.connection.close()
  next()
}

module.exports.down = async (next) => {
  await db.connect(dbUri)

  const mongoClient = mongoose.connection.client;
  const vasDb = mongoClient.db("vas");
  const teams = vasDb.collection("teams");
  let days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  let updates = [];
  await teams.find({availability: {$exists: true}}).forEach(item => {
    let dayOfWeek = {};
    for (let day of days) {
      dayOfWeek[day] = item.availability.filter(obj => obj.dayOfWeek === day).length === 1;
    }
    item.dayOfWeek = dayOfWeek;
    item.startTime = item.availability[0].startTime;
    item.endTime = item.availability[0].endTime;

    item.availability = null
  });

  await teams.updateMany({}, updates, {
    $unset: {
      availability: 1
    }
  })

  mongoose.connection.close()
  next()
}
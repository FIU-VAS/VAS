'use strict'
const mongoose = require('mongoose');
const db = require("../services/db.js").default;
const config = require("../config/config.js").default;
const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`


module.exports.up = async function (next) {
  await db.connect(dbUri);

  const vasDb = mongoose.connection.client.db("vas");
  const userCollection = vasDb.collection("users");

  let updates = [];

  await userCollection.find({role: "volunteer", pantherID: {$type: "number"}}).forEach(user => {
    let pid = user.pantherID;
    updates.push({
      updateOne: {
        filter: {
          _id: user._id,
        },
        update: {
          $set: {
            pantherID: String(pid)
          }
        }
      }
    })
  });

  if (updates.length) {
    await userCollection.bulkWrite(updates)
  }

  next()
}

module.exports.down = async function (next) {
  await db.connect(dbUri);

  const vasDb = mongoose.connection.client.db("vas");
  const userCollection = vasDb.collection("users");

  let updates = [];

  userCollection.find({role: "volunteer", pantherID: {$type: 1}}).forEach(user => {
    let pid = user.pantherID;
    updates.push({
      updateOne: {
        filter: {
          _id: user._id,
        },
        update: {
          $set: {
            pantherID: Number(pid)
          }
        }
      }
    })
  });

  if (updates.length) {
    await userCollection.bulkWrite(updates)
  }

  next()
}

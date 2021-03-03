'use strict'
const mongoose = require('mongoose');
const db = require("../services/db.js").default;
const config = require("../config/config.js").default;
const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`

const run = async (upgrade=true) => {
  let updateCollection;
  if (upgrade) {
    updateCollection = async (collection, role) => {
      await collection.updateMany({__t: role}, {$unset: {__t: 1}})
    }
  } else {
    updateCollection = async (collection, role) => {
      await collection.updateMany({role: role}, {$set: {__t: role}})
    }
  }

  await db.connect(dbUri);

  const vasDb = mongoose.connection.client.db("vas");
  const userCollection = vasDb.collection("users");
  await updateCollection(userCollection, "admin");
  await updateCollection(userCollection, "volunteer");
  await updateCollection(userCollection, "schoolPersonnel");
}

module.exports.up = async function (next) {
  await run(true)
  next()
}

module.exports.down = async function (next) {
  await run(false);
  next()
}

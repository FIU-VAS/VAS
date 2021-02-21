import migrate from "migrate";
const mongoose = require('mongoose');

const db = require("../services/db.js").default;
const config = require("../config/config.js").default;
const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`;

export default class MongoStore {

    async load (fn) {
        await db.connect(dbUri);
        let migrations = {};
        try {
            const client = mongoose.connection.client;
            const vas = client.db("vas");
            migrations = await vas.collection('db_migrations').find().toArray();
            if (migrations.length !== 1) {
                console.log('Cannot read migrations from database. If this is the first time you run migrations, then this is normal.')
                return fn(null, {})
            }
        } catch (err) {
            throw err
        }
        return fn(null, migrations[0])
    }

    async save (set, fn) {
        await db.connect(dbUri);
        let migrations;
        try {
            const client = mongoose.connection.client;
            const vas = client.db("vas");
            migrations = await vas.collection('db_migrations')
                .update({}, {
                    $set: {
                        lastRun: set.lastRun
                    },
                    $push: {
                        migrations: { $each: set.migrations }
                    }
                }, { upsert: true });
        } catch (err) {
            throw err
        }
        return fn(null, migrations)
    }
}

module.exports = MongoStore
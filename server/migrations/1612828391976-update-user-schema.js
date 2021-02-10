'use strict'
const mongoose = require('mongoose');
const fs = require('fs');

const db = require("../services/db.js").default;
const config = require("../config/config.js").default;
const User = require("../models/Users/user_Auth.js").default;
const UserRoles = require("../models/Users/user_Auth.js").UserRoles;

const SchoolPersonnelUser = require("../models/Users/school_User.js").default;
const AdminUser = require("../models/Users/admin_User.js").default;
const VolunteerUser = require("../models/Users/volunteer_User.js").default;
const assert = require("assert");

const OldRoles = Object.freeze({
    Admin: 'Admin',
    SchoolPersonnel: 'School Personnel',
    Volunteer: 'Volunteer'
});

const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`

const createCollections = async (userCollection, collection, Schema, oldRole, props) => {
    const results = await Schema.find();
    for (const result of results) {
        let schemaProps = {};
        let userSchemaProps = {};
        for (const prop of props) {
            schemaProps[prop] = result[prop];
            userSchemaProps[prop] = 1;
        }
        await userCollection.updateOne({email: result.email}, {
            $set: {
                role: oldRole
            },
            $unset: {
                ...userSchemaProps,
                __t: 1
            }
        })
        await collection.insertOne({
            ...schemaProps,
            email: result.email
        });
    }
}

const getAllUserByCollection = async (collection) => {
    const cursor = await collection.find();
    const count = await cursor.count();
    if (count === 0) {
        console.log("No users found in collection");
    }
    let results = [];
    await cursor.forEach(obj => results.push(obj))
    return results;
}

const updateUsers = async (users, Schema, role, props) => {
    for (const user of users) {
        await User.updateOne({email: user.email}, {
            role: role,
            __t: role
        });
        const schemaProps = {}
        for (const prop of props) {
            if (user.hasOwnProperty(prop)) {
                schemaProps[prop] = user[prop];
            }
        }
        await Schema.updateOne({email: user.email}, schemaProps)
    }
}

const rollbackToDifferentCollections = async () => {
    const mongoClient = mongoose.connection.client;
    const vasDb = mongoClient.db("vas");
    const adminCollection = vasDb.collection("admins");
    const volunteerCollection = vasDb.collection("volunteers");
    const schoolPersonnelCollection = vasDb.collection("schoolpersonnels");
    const userCollection = vasDb.collection("users");

    await createCollections(userCollection, adminCollection, AdminUser, OldRoles.Admin, [
        'firstName', 'lastName', 'phoneNumber', 'isActive'
    ])
    await createCollections(userCollection, volunteerCollection, VolunteerUser, OldRoles.Volunteer, [
        'firstName', 'lastName', 'phoneNumber', 'isActive', 'pantherID', 'major',
        'carAvailable', 'volunteerStatus', 'MDCPS_ID'
    ])
    await createCollections(userCollection, schoolPersonnelCollection, SchoolPersonnelUser, OldRoles.SchoolPersonnel, [
        'firstName', 'lastName', 'phoneNumber', 'isActive', 'schoolCode', 'title'
    ])
}

module.exports.up = async function (next) {
    if (!fs.existsSync('./vas-backup')) {
        throw new Error("Make sure [vas-backup] file exists in the directory to restore in case of failure")
    }

    console.log("Connecting to db");
    await db.connect(dbUri)

    const mongoClient = mongoose.connection.client;
    const vasDb = mongoClient.db("vas");
    const adminCollection = vasDb.collection("admins");
    const volunteerCollection = vasDb.collection("volunteers");
    const schoolPersonnelCollection = vasDb.collection("schoolpersonnels");

    const admins = await getAllUserByCollection(adminCollection);
    const volunteers = await getAllUserByCollection(volunteerCollection);
    const schoolPersonnel = await getAllUserByCollection(schoolPersonnelCollection);

    console.log("Migrating users to new schemas");

    await updateUsers(admins, AdminUser, UserRoles.Admin, [
        'firstName', 'lastName', 'phoneNumber', 'isActive'
    ])
    await updateUsers(volunteers, VolunteerUser, UserRoles.Volunteer, [
        'firstName', 'lastName', 'phoneNumber', 'isActive', 'pantherID', 'major',
        'carAvailable', 'volunteerStatus', 'MDCPS_ID'
    ])
    await updateUsers(schoolPersonnel, SchoolPersonnelUser, UserRoles.SchoolPersonnel, [
        'firstName', 'lastName', 'phoneNumber', 'isActive', 'schoolCode', 'title'
    ])

    console.log("Testing all users have been created in new schemas");
    const newAdmins = await AdminUser.find();
    const newVolunteers = await VolunteerUser.find();
    const newSchoolPersonnel = await SchoolPersonnelUser.find();
    adminCollection.drop()
    volunteerCollection.drop()
    schoolPersonnelCollection.drop()
    try {
        assert(admins.length === newAdmins.length, "Admins were not created successfully");
        assert(volunteers.length === newVolunteers.length, "Admins were not created successfully");
        assert(schoolPersonnel.length === newSchoolPersonnel.length, "Admins were not created successfully");
    } catch (assertionError) {
        console.log("Migration failed!! Check configuration and try again");
        await rollbackToDifferentCollections();
        throw assertionError
    }
    console.log("Finished migration, closing connection");
    await mongoose.connection.close();
    console.log("Connection closed");
    next()
}

module.exports.down = async function (next) {
    const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`
    await db.connect(dbUri)

    await rollbackToDifferentCollections()

    next()
}

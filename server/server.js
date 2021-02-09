import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import cors from 'cors';
import {Severity, log} from './utils/logger';
import db from './services/db.js';
import api from './api';
import config from './config/config';
import passport from './config/passport'
import {checkMigrations} from "./utils/migration";

const app = express();

// passport middleware
app.use(passport.initialize());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("../../html"))

app.use('/api', api);

checkMigrations({
    store: path.join(__dirname, '.migrate'),
    migrationsDir: path.join(__dirname, 'migrations')
}).then((migrationsRan) => {
    if (!migrationsRan) {
        log("App might not work properly. Please run migrations and restart server!", Severity.Error);
        log("Run npm run migrate-up", Severity.Error);
    }
}).catch(err => {
    if (err.code === "ENOENT") {
        log("No migration state file was detected. App might not work properly. " +
            "Please run migrations and restart server!", Severity.Error);
        log("Run npm run migrate-init", Severity.Error);
        log("Then run npm run migrate-up", Severity.Error);
    }
});

app.listen(config.port, () => {
    log(`VAS server now up on http://localhost:${config.port}`, Severity.Success);
    const dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.url}/${config.db.name}`
    db.connect(dbUri);
});
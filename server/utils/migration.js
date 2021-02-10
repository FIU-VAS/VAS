const migrate = require('migrate')
import {log, Severity} from "./logger"
const defaultOptions = {
    store: '../.migrate',
    migrationsDir: '../migrations'
}

// Load in migrations

export const checkMigrations = (opts) => {
    const options = Object.assign({}, defaultOptions, opts);
    return new Promise((resolve, reject) => {
        migrate.load({
            stateStore: options.store,
            migrationsDirectory: options.migrationsDir,
        }, function (err, set) {
            if (err) {
                log(err, Severity.Error)
                reject(err);
            }
            let allMigrationsRan = true;
            set.migrations.forEach(function (migration) {
                if (!migration.timestamp) {
                    log(`Migration [${migration.title}] has not been run`, Severity.Warning);
                    allMigrationsRan = false
                }
            })
            resolve(allMigrationsRan)
        })
    })
}
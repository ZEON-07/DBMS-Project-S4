const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    // Read schema.sql
    try {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema.sql instructions
        db.exec(schemaSql, (err) => {
            if (err) {
                console.error('Failed to execute schema.sql:', err.message);
            } else {
                console.log('Schema executed successfully (tables and triggers loaded).');
            }
        });
    } catch (readErr) {
        console.error("Could not read schema.sql:", readErr.message);
    }
}

module.exports = db;

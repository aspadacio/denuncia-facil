//const { Pool } = require('pg');

const db = new Pool({
    user:       process.env['DB_USER'],
    host:       process.env['DB_HOST'],
    database:   process.env['DB_SCHEMA'],
    password:   process.env['DB_PWD'],
    port:       process.env['DB_PORT'],
});

module.exports = db;
require('dotenv').config(); // we can use node process.env to access those variables

module.exports = {
    PORT:       process.env.PORT,
    DB_HOST:    process.env.DB_HOST,
    DB_PORT:    process.env.DB_PORT,
    DB_NAME:    process.env.DB_NAME
}
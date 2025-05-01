const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING });
module.exports = pool;
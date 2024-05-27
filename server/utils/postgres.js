const pg = require('pg');
const { Client } = pg
 
const pgClient = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
})

pgClient.connect();

module.exports = pgClient;
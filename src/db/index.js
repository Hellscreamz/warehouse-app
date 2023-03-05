const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '930401',
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message);
  });

module.exports = pool;

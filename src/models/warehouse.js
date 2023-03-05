const pool = require('../db/index');

const warehouses = {
  Query: {
    warehouses: async () => {
      const query = 'SELECT * FROM warehouses';
      try {
        const {rows} = await pool.query(query);
        return rows;
      } catch (err) {
        throw new Error(`Failed to fetch warehouses! Error: ${err.message}`);
      }
    },
  },
};

module.exports = warehouses;

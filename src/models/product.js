const pool = require('../db/index');

const products = {
  Query: {
    products: async () => {
      const query = 'SELECT * from products';
      try {
        const {rows} = await pool.query(query);
        return rows;
      } catch (err) {
        throw new Error(`Failed to fetch products! Error: ${err.message}`);
      }
    },
  },
};

module.exports = products;

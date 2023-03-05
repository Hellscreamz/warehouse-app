const pool = require('../db/index');
const dateConverter = require('../utils/dateConverter');

const stockMovements = {
  Query: {
    stockMovements: async () => {
      const query = 'SELECT * FROM stock_movements';
      try {
        const {rows} = await pool.query(query);
        return dateConverter.convertDate(rows);
      } catch (err) {
        throw new Error(`Failed to fetch stock movements! Error: ${err.message}`);
      }
    }
  },
};
module.exports = stockMovements;

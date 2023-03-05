const {DataSource} = require('apollo-datasource');
const pool = require('../db/index');
const dateConverter = require('../utils/dateConverter');
class StockMovementAPI extends DataSource {
  async getStockMovements() {
    try {
      const query = await pool.query('SELECT * FROM stock_movements ORDER BY date DESC');
      return query.rows;
    } catch (err) {
      throw new Error(`Stock Movements API Get All Stock Movements! Error: ${err.message}`);
    }
  }

  async stockMovementsByProduct(product_id) {
    try {
      const query = {
        text: 'SELECT * FROM stock_movements WHERE product_id=$1 ORDER BY date DESC',
        values: [product_id],
      };
      const {rows} = await pool.query(query);
      return dateConverter.convertDate(rows);
    } catch (err) {
      throw new Error(`Stock Movements API Get Movements by product! Error: ${err.message}`);
    }
  }

  async stockMovementByWarehouse(warehouseId) {
    try {
      const query = {
        text: 'SELECT * FROM stock_movements WHERE warehouse_id = $1 ORDER BY date DESC',
        values: [warehouseId],
      };
      const {rows} = await pool.query(query);
      return dateConverter.convertDate(rows);
    } catch (err) {
      throw new Error(`Stock Movements API Get Movements by warehouse! Error: ${err.message}`);
    }
  }

  async stockMovementsByDate(date) {
    try {
      const query = {
        text: 'SELECT * FROM stock_movements WHERE date=$1 ORDER BY date DESC',
        values: [date],
      };
      const {rows} = await pool.query(query);
      return dateConverter.convertDate(rows);
    } catch (err) {
      throw new Error(`Stock Movements API Get Movements by Date! Error: ${err.message}`);
    }
  }
}

module.exports = StockMovementAPI;

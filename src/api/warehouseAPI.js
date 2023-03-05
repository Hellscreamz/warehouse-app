const {DataSource} = require('apollo-datasource');
const pool = require('../db/index');

const stockMovementHelper = require('./helpers/stockMovementHelper');

class WarehouseAPI extends DataSource {
  async createWarehouse(name, size, is_hazardous) {
    const query = {
      text: 'INSERT INTO warehouses(name, size, is_hazardous) VALUES ($1, $2, $3) RETURNING *',
      values: [name, size, is_hazardous],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }

  async updateWarehouse(id, name, size, is_hazardous) {
    const query = {
      text: 'UPDATE warehouses SET name = $1, size = $2, is_hazardous = $3 WHERE id = $4 RETURNING *',
      values: [name, size, is_hazardous, id],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }

  async importProduct(productId, warehouseId, amount, date) {
    return stockMovementHelper.updateImpExp(productId, warehouseId, amount, date, true);
  }

  async exportProduct(productId, warehouseId, amount, date) {
    return stockMovementHelper.updateImpExp(productId, warehouseId, amount, date, false);
  }
}

module.exports = WarehouseAPI;

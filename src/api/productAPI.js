const {DataSource} = require('apollo-datasource');
const pool = require('../db/index');

class ProductAPI extends DataSource {
  async createProduct(name, size_per_unit, is_hazardous) {
    try {
      const query = {
        text: 'INSERT INTO products(name, size_per_unit, is_hazardous) VALUES ($1, $2, $3) RETURNING *',
        values: [name, size_per_unit, is_hazardous],
      };
      const {rows} = await pool.query(query);
      return rows[0];
    } catch (err) {
      throw new Error(`Product API Create Product! Error: ${err.message}`);
    }
  }

  async updateProduct(id, name, size_per_unit, is_hazardous) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Acquire a lock on the products table
      await client.query('LOCK TABLE products IN EXCLUSIVE MODE');
      // Update the product
      const query = {
        text: 'UPDATE products SET name = $1, size_per_unit = $2, is_hazardous = $3 WHERE id = $4 RETURNING *',
        values: [name, size_per_unit, is_hazardous, id],
      };
      const {rows} = await client.query(query);
      await client.query('COMMIT');
      return rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Product API Update Product! Error: ${err.message}`);
    } finally {
      client.release();
    }
  }

  async deleteProduct(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Acquire a lock on the products table
      await client.query('LOCK TABLE products IN EXCLUSIVE MODE');
      // Update the stock_movements table to set product_id to NULL for the given product
      const updateStockMovementsQuery = `
        UPDATE stock_movements
        SET product_id = NULL
        WHERE product_id = $1;
      `;
      await client.query(updateStockMovementsQuery, [id]);
      // Delete the product
      const deleteProductQuery = {
        text: 'DELETE FROM products WHERE id = $1 RETURNING *',
        values: [id],
      };
      const {rows} = await client.query(deleteProductQuery);
      await client.query('COMMIT');
      return rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`Product API Delete Product! Error: ${err.message}`);
    } finally {
      client.release();
    }
  }
}

module.exports = ProductAPI;

const pool = require('../../db/index');

class Space {
  static async update() {
    const client = await pool.connect();
    try {
      // Get all the products
      const productsQuery = `SELECT id, size_per_unit FROM products`;
      const productsResult = await client.query(productsQuery);
      const products = productsResult.rows;

      // Get all the warehouses
      const warehousesQuery = `SELECT id, size FROM warehouses`;
      const warehousesResult = await client.query(warehousesQuery);
      const warehouses = warehousesResult.rows;

      // Get the current stock amounts per warehouse and product
      const stockQuery = `
        SELECT
          product_id,
          warehouse_id,
          SUM(CASE WHEN is_import THEN amount ELSE -amount END) AS stock_in
        FROM stock_movements
        GROUP BY product_id, warehouse_id
      `;
      const stockResult = await client.query(stockQuery);

      // Calculate the free space remaining per warehouse
      const spaceData = warehouses.map((warehouse) => {
        const stockIn = stockResult.rows
          .filter((stock) => stock.warehouse_id === warehouse.id)
          .reduce((total, stock) => {
            const product = products.find((product) => product.id === stock.product_id);
            if (!product) {
              console.warn(`WARNING: Stock movement with invalid product ID (${stock.product_id}) encountered.`);
              return total;
            }
            return total + stock.stock_in * product.size_per_unit;
          }, 0);
        const freeSpace = warehouse.size - stockIn;
        return {
          warehouse_id: warehouse.id,
          free_space: freeSpace,
          stock_in: stockIn,
        };
      });

      // Delete all existing data from the space table
      const deleteQuery = 'DELETE FROM space';
      await client.query(deleteQuery);

      // Insert the new space data into the space table
      const insertQuery = 'INSERT INTO space (warehouse_id, free_space, stock_in) VALUES ($1, $2, $3)';
      await Promise.all(
        spaceData.map((data) => {
          return client.query(insertQuery, [data.warehouse_id, data.free_space, data.stock_in]);
        })
      );

      // Check for stock in exceeding warehouse capacity and log a warning message
      stockResult.rows.forEach((stock) => {
        const product = products.find((product) => product.id === stock.product_id);
        if (!product) {
          console.warn(`WARNING: Stock movement with invalid product ID (${stock.product_id}) encountered.`);
          return;
        }
        const warehouse = warehouses.find((warehouse) => warehouse.id === stock.warehouse_id);
        const stockSize = stock.stock_in * product.size_per_unit;
        if (warehouse && warehouse.size && stockSize > warehouse.size) {
          console.warn(`WARNING: Stock in exceeds warehouse capacity. Capacity of the warehouse: (${warehouse.size})`);
        }
      });
    } finally {
      client.release();
    }
  }
}

module.exports = Space;

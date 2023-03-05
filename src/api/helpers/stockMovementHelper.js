const dateConverter = require('../../utils/dateConverter');
const pool = require('../../db/index');

async function updateImpExp(productId, warehouseId, amount, date, isImport) {
  // Get the product hazard status
  const productQuery = {
    text: 'SELECT is_hazardous FROM products WHERE id = $1',
    values: [productId],
  };
  const productResult = await pool.query(productQuery);
  const isProductHazardous = productResult.rows[0].is_hazardous;

  // Get the warehouse hazard status
  const warehouseQuery = {
    text: 'SELECT is_hazardous FROM warehouses WHERE id = $1',
    values: [warehouseId],
  };
  const warehouseResult = await pool.query(warehouseQuery);
  const isWarehouseHazardous = warehouseResult.rows[0].is_hazardous;

  // Get the warehouse size
  const warehouseQuerySize = {
    text: 'SELECT size FROM warehouses WHERE id = $1',
    values: [warehouseId],
  };
  const warehouseResultSize = await pool.query(warehouseQuerySize);
  const whSize = warehouseResultSize.rows[0].size;

  // Get the size_per_unit product
  const productSizePerUnitQuery = {
    text: 'SELECT size_per_unit FROM products WHERE id = $1',
    values: [productId],
  };
  const sizePerUnit = await pool.query(productSizePerUnitQuery);
  const sizePerUnitResult = sizePerUnit.rows[0].size_per_unit;

  if (Number(whSize) < Number(sizePerUnitResult)) {
    throw new Error('This product size is much bigger than warehouse size.');
  }

  // Check whether the warehouse is suitable for storing the product
  if ((isProductHazardous && !isWarehouseHazardous) || (!isProductHazardous && isWarehouseHazardous)) {
    throw new Error('This warehouse is not suitable for storing this product.');
  }

  const query = {
    text: 'INSERT INTO stock_movements(product_id, warehouse_id, amount, date, is_import) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values: [productId, warehouseId, amount, date, isImport],
  };
  const {rows} = await pool.query(query);
  return dateConverter.convertDate(rows)[0];
}

module.exports = {
  updateImpExp: updateImpExp,
};

// SQL commands to create tables
const createProductsTableQuery = `CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size_per_unit DECIMAL NOT NULL,
    is_hazardous BOOLEAN NOT NULL
  );`;

const createWarehousesTableQuery = `CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size DECIMAL NOT NULL,
    is_hazardous BOOLEAN NOT NULL
  );`;

const createStockMovementsTableQuery = `CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    amount DECIMAL NOT NULL,
    date DATE NOT NULL,
    is_import BOOLEAN NOT NULL
  );`;

const createSpaceTableQuery = `TABLE space (
  warehouse_id INTEGER PRIMARY KEY,
  free_space NUMERIC,
  stock_in NUMERIC
);`;

async function createDatabase() {
  try {
    await pool.query(createProductsTableQuery);
    await pool.query(createWarehousesTableQuery);
    await pool.query(createStockMovementsTableQuery);
    await pool.query(createSpaceTableQuery);

    console.log('Database created successfully.');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    pool.end();
  }
}

module.exports = createDatabase;

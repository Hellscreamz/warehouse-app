const {gql} = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    size_per_unit: Float!
    is_hazardous: Boolean!
  }

  type Warehouse {
    id: ID!
    name: String!
    size: Float!
    is_hazardous: Boolean!
  }

  type StockMovement {
    id: ID!
    product_id: ID!
    warehouse_id: ID!
    amount: Float!
    date: String!
    is_import: Boolean!
  }

  type Query {
    products: [Product!]!
    warehouses: [Warehouse!]!
    stockMovements: [StockMovement!]!
    stockMovementByWarehouse(warehouseId: ID!): [StockMovement!]!
    stockMovementByDate(date: String!): [StockMovement!]!
    stockMovementsByProduct(productId: String): [StockMovement!]!
  }

  type Mutation {
    createProduct(name: String!, size_per_unit: Float!, is_hazardous: Boolean!): Product!
    updateProduct(id: ID!, name: String, size_per_unit: Float, is_hazardous: Boolean): Product!
    deleteProduct(id: ID!): Product!

    createWarehouse(name: String!, size: Float!, is_hazardous: Boolean!): Warehouse!
    updateWarehouse(id: ID!, name: String, size: Float, is_hazardous: Boolean): Warehouse!

    importProduct(product_id: ID!, warehouse_id: ID!, amount: Float!, date: String!): StockMovement!
    exportProduct(product_id: ID!, warehouse_id: ID!, amount: Float!, date: String!): StockMovement!
  }
`;

module.exports = typeDefs;

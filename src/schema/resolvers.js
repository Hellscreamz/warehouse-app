const productsModel = require('../models/product');
const stockMovementsModel = require('../models/stockMovements');
const warehousesModel = require('../models/warehouse');

const resolvers = {
  Query: {
    products: productsModel.Query.products,
    stockMovements: stockMovementsModel.Query.stockMovements,
    warehouses: warehousesModel.Query.warehouses,
    stockMovementByDate: async (_, {date}, {dataSources}) => {
      return await dataSources.stockMovementAPI.stockMovementsByDate(date);
    },
    stockMovementByWarehouse: async (_, {warehouseId}, {dataSources}) => {
      return await dataSources.stockMovementAPI.stockMovementByWarehouse(warehouseId);
    },
    stockMovementsByProduct: async (_, {productId}, {dataSources}) => {
      return await dataSources.stockMovementAPI.stockMovementsByProduct(productId);
    },
  },
  Mutation: {
    createProduct: async (_, {name, size_per_unit, is_hazardous}, {dataSources}) => {
      return dataSources.productAPI.createProduct(name, size_per_unit, is_hazardous);
    },
    updateProduct: async (_, {id, name, size_per_unit, is_hazardous}, {dataSources}) => {
      return dataSources.productAPI.updateProduct(id, name, size_per_unit, is_hazardous);
    },
    deleteProduct: async (_, {id}, {dataSources}) => {
      return dataSources.productAPI.deleteProduct(id);
    },
    createWarehouse: async (_, {name, size, is_hazardous}, {dataSources}) => {
      return dataSources.warehouseAPI.createWarehouse(name, size, is_hazardous);
    },
    updateWarehouse: async (_, {id, name, size, is_hazardous}, {dataSources}) => {
      return dataSources.warehouseAPI.updateWarehouse(id, name, size, is_hazardous);
    },
    importProduct: async (_, {product_id, warehouse_id, amount, date}, {dataSources}) => {
      return dataSources.warehouseAPI.importProduct(product_id, warehouse_id, amount, date);
    },
    exportProduct: async (_, {product_id, warehouse_id, amount, date}, {dataSources}) => {
      return dataSources.warehouseAPI.exportProduct(product_id, warehouse_id, amount, date);
    },
  },
};
module.exports = resolvers;

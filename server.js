const express = require('express');
const dotenv = require('dotenv');
const {ApolloServer} = require('apollo-server-express');
const {makeExecutableSchema} = require('@graphql-tools/schema');
const typeDefs = require('./src/schema/type-def');
const resolvers = require('./src/schema/resolvers');
const ProductAPI = require('./src/api/productAPI');
const WarehouseAPI = require('./src/api/warehouseAPI');
const StockMovementAPI = require('./src/api/stockMovementAPI');
const spaceService = require('./src/calculations/services/updateSpace');

const app = express();

dotenv.config({path: './src/config/config.env'});
app.use(express.json());

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  dataSources: () => ({
    productAPI: new ProductAPI(),
    warehouseAPI: new WarehouseAPI(),
    stockMovementAPI: new StockMovementAPI(),
  }),
});

(async function () {
  await server.start();
  server.applyMiddleware({app});
  app.listen(process.env.SERVER_PORT, () => {
    spaceService.callUpdateSpaceService(app);
    console.log(`🚀 Server ready! Click the link to access apollo studio http://localhost:4000${server.graphqlPath}`);
  });
})();

// index.js
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/use/ws");

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/user");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const pubsub = require("./pubsub"); // 👈 Explicitly linking the communication hub

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

console.log("connecting to MongoDB...");

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // 1. Create the WebSocket server configuration
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  // 2. Create the unified schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // 3. Hand off the schema to the WebSocket runner with explicit connection validation
  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        console.log("🚀 Client successfully connected over WebSocket!");
      },
    },
    wsServer,
  );

  // 4. Configure Apollo Server with cleanup plugins
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  // 5. Connect Apollo to Express routing middleware
  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
          } catch (error) {
            return null;
          }
        }
      },
    }),
  );

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`),
  );
};

start();

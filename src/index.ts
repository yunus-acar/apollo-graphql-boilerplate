import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { execute, subscribe } from "graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { buildSchema } from "type-graphql";
import resolvers from "./graphql/resolvers";
import { createContext, MyContext } from "./graphql/context";
import { applyResolversEnhanceMap } from "./generated/typegql-prisma";
import { resolversEnhanceMap } from "./graphql/enhances";
import { authChecker } from "./utils/authChecker";
import initializeApp from "./utils/initializeApp";

dotenv.config();
const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  applyResolversEnhanceMap(resolversEnhanceMap);
  const schema = await buildSchema({
    resolvers,
    authChecker,
    validate: false,
  });

  const server = new ApolloServer({
    context: (ctx: MyContext) => ({ ...createContext(ctx) }),
    schema,
  });

  await server.start();
  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );

  app.use(graphqlUploadExpress());
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use("/public", express.static("public"));

  server.applyMiddleware({ app, cors: false });
  await initializeApp();
  httpServer.listen(PORT);

  return { server, subscriptionServer };
}

startServer()
  .then((r) => {
    console.log(
      "GraphQL Endpoint started at 🚀 :: ",
      `http://localhost:${PORT}${r.server.graphqlPath}`
    );
  })
  .catch((err) => {
    console.log("Server cannot started 👉  :: ", err);
  });

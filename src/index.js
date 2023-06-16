import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import  Jwt  from "jsonwebtoken";
import { typeDefs } from "./SchemaUSer/typedefsUser.js";
import { resolvers } from "./SchemaUSer/ResolverUser.js";
import { connection } from "./data/dbConnect.js";
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    const token = req.headers.authorization

    if (!token) {
      throw new Error('no se proporciono un token ')
    }

    try {
      const decoded = Jwt.verify(token, 'secret')
      return {userId: decoded.userId}
    } catch (error) {
      throw new Error('token invalido o expirado')
    }
  }
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}gql`);

connection()
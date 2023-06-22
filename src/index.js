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

     let userId = null
     let role = null
    try {
      const decoded = Jwt.verify(token, 'secret123')
      userId =  decoded.userId
      role = decoded.role
    } catch (error) {
      throw new Error('token invalido o expirado')
    }
    return {
      userId,
      role,
      db: connection(),
    };
  }
  
}, 
);



const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

connection()
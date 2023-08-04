import { ApolloServer } from '@apollo/server'
// import  Jwt  from "jsonwebtoken";
import { typeDefs } from './SchemaUSer/typedefsUser.js'
import { resolvers } from './SchemaUSer/ResolverUser.js'
import { connection } from './data/dbConnect.js'
connection()

import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { expressMiddleware } from '@apollo/server/express4'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default'

const app = express()

const schema = makeExecutableSchema({ typeDefs, resolvers })

const startChaskyApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageProductionDefault({
        embed: true
      }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })

  const httpServer = createServer(app)
  const subscriptionServer = new WebSocketServer({
    server: httpServer,
    path: '/gql'
  })

  const serverCleanup = useServer(
    {
      schema
    },
    subscriptionServer
  )

  await server.start()
  const path = '/gql'

  app.use(path, express.json(), expressMiddleware(server))

  const port = process.env.PORT || 4001
  await new Promise((resolve) => httpServer.listen({ port }, resolve))

  console.log(`🚀 [Chasky GQL] Server ready at http://localhost:${port}${path}`)
  console.log(`🚀 [Chasky WS] Subscriptions ready at ws://localhost:${port}${path}`)
}

startChaskyApolloServer().then()

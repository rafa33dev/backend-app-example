export const typeDefs = `

  type User {
    id: ID
    name: String
    username: String
    email: String
    phone: String
    website: String
    avatar: String
  }

  
  type Query {
    Users:[User]
    User(id:ID!):User
    }

    type Query {
      GetUserPosts(userId: ID!): [Post!]!
    }

    input CreateUser {
      name: String!
      email: String!
    }

    type DeleteUserResponse {
      success: Boolean
      message: String
    }
    
    type Post {
      id: ID!
      title: String!
      content: String!
      author: User!
    }

   

  type Mutation{
   CreateUser(input:CreateUser!): User
   updateUser(id: ID!, name: String!): User
   DeleteUser(id:ID!) : DeleteUserResponse
  }  
  
  type Mutation {
    Login(email: String!, password:String!): String
  }
  
  type Mutation {
    CreatePost(title: String!, content: String!, authorId: ID!): Post
  }

`;



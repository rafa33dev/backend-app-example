export const typeDefs = `

  type User {
    id: ID
    name: String
    username: String
    email: String
    phone: String
    website: String
    avatar: String
    posts: [Post!]!
  }

  input User_filter {
    _id: String
  }
  
  type Query {
    GetUsers(filter: User_filter):[User]
    GetUserById(id:ID!):User
    GetAllPost: [Post!]!
    }

 
    input CreateUser {
      name: String!
      email: String!
      password: String!
    }

    type DeleteUserResponse {
      success: Boolean
      message: String
    }
    
    type Post {
      id: ID!
      title: String!
      content: String!
      #author: User!
    }

   

  type Mutation{
   CreateUser(input:CreateUser!): User
   updateUser(id: ID!, name: String!): User
   DeleteUser(id:ID!) : DeleteUserResponse
  }  
  
  type Mutation {
    Login(email: String!, password:String!): String!
  }
  
  type Mutation {
    CreatePost(title: String!, content: String!, authorId: ID!): Post!
  }

`;


// createdAt: String!
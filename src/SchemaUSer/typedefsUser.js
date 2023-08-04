export const typeDefs = `
 directive @hasRole(roles: [String!]!) on FIELD_DEFINITION

  type User {
    id: ID
    name: String
    username: String
    email: String
    website: String
    avatar: String
    posts: [Post!]
    role: String!
  }

  input User_filter {
    _id: String
  }
  
  type Query {
    GetUsers(filter: User_filter):[User]! @hasRole(roles:["admin"])
    GetUserById(id:ID!):User @hasRole(roles:["admin"])
    AdminOnly: String! @hasRole(roles: ["admin"])
    Post(id:ID!): Post!
    Comment(id: ID!) : Comment
    GetPostComments(postId: ID!): [Comment]!
    GetPosts: [Post]!
    }
    
    enum UserRole {
      admin
      usuario
    }
 
    input CreateUser {
      name: String!
      username: String
      email: String!
      avatar: String
      website: String
      password: String!
      role: UserRole
    }


    type DeleteUserResponse {
      success: Boolean
      message: String
    }
    
    type Post {
      id: ID
      title: String
      content: String
      author: User
      comments: [Comment!]
      commentCount: Int!
      createdAt: String
      updatedAt: String

    }

   
    type Comment {
      id: ID
      content: String
      author: User
      createdAt: String
      updatedAt: String
    }

   
  type Mutation{
   CreateUser(input:CreateUser!): User
   updateUser(id: ID!, name: String!, role: String!): User
   DeleteUser(id:ID!) : DeleteUserResponse
  }  
  
  type Mutation {
    Login(email: String!, password:String!): String!
  }

  input Author {
    id:ID
    name: String
    avatar: String
  }
  
  
  input CreatePost {
      title: String!
      content: String!
      author: Author
  }

  input CreateComment {
    postId: ID!
    content: String!
    author: Author
  }


  type Mutation {
    CreatePost(input: CreatePost!): Post
    DeletePost(id: ID!): String
    CreateComment(input: CreateComment): Comment!
    DeleteComment(id: ID!): String 
  }


  type Subscription {
    NewPost(userID: ID!): Post!
    CountPost: Int
    NewComment(postId: ID!,userId: ID! ): Comment!
  }


`;



// type Mutation {
//   createUser(name: String!, email: String!, password: String!): User!  # Mutación accesible para todos los roles
//   updateUser(id: ID!, name: String!, email: String!): User! @hasRole(roles: ["admin"])  # Ejemplo de mutación que requiere rol de administrador
//   deleteUser(id: ID!): User! @hasRole(roles: ["admin"])  # Ejemplo de mutación que requiere rol de administrador
// }


// export const typeDefs = `
//  directive @hasRole(roles: [String!]!) on FIELD_DEFINITION

//   type User {
//     id: ID
//     name: String
//     username: String
//     email: String
//     website: String
//     avatar: String
//     posts: [Post!]
//     role: String!
//   }

//   input User_filter {
//     _id: String
//   }
  
//   type Query {
//     GetUsers(filter: User_filter):[User]! @hasRole(roles:["admin"])
//     GetUserById(id:ID!):User @hasRole(roles:["admin"])
//     AdminOnly: String! @hasRole(roles: ["admin"])
//     Post(id:ID!): Post!
//     Comment(id: ID!) : Comment
//     GetPostComments(postId: ID!): [Comment]
//     GetPosts: [Post]!
//     }
    
//     enum UserRole {
//       admin
//       usuario
//     }
 
//     input CreateUser {
//       name: String!
//       username: String
//       email: String!
//       avatar: String
//       website: String
//       password: String!
//       role: UserRole
//     }

//     type DeleteUserResponse {
//       success: Boolean
//       message: String
//     }
    
//     type Post {
//       id: ID
//       title: String
//       content: String
//       author: Author
//       comments: [Comment!]
//       commentCount: Int!
//       createdAt: String
//       updatedAt: String

//     }

//     type Author {
//       user(idUser:ID!): User
//     }
   
//     type Comment {
//       id: ID
//       content: String
//       author: User!
//       createdAt: String
//       updatedAt: String
//     }

   
   

//   type Mutation{
//    CreateUser(input:CreateUser!): User
//    updateUser(id: ID!, name: String!, role: String!): User
//    DeleteUser(id:ID!) : DeleteUserResponse
//   }  
  
//   type Mutation {
//     Login(email: String!, password:String!): String!
//   }
  
//   type Mutation {
//     CreatePost(title: String!, content: String!, authorId: ID!): Post!
//     DeletePost(id: ID!): String
//     CreateComment(postId: ID!, content: String!, userId: ID!): Comment!
//     DeleteComment(id: ID!): String 
//   }


//   type Subscription {
//     NewPost(userID: ID!): Post!
//     NewComment(postId: ID!,userId: ID! ): Comment!
//   }


// `;

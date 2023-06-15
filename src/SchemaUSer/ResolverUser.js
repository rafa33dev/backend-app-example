import {users} from "../data/data.js";
import { v1 as uuid } from "uuid";
import { createPost, getUserPosts } from "../SchemaPost/ResolverPost.js";
import { posts } from "../data/postUserData.js";

export const resolvers = {
  Query: {
    Users: () => users,
    User: (parent, args) => {
      const user = users.find(n => n.id.toString() === args.id)
      return user 
    },
    GetUserPosts: (_,{userId}) => getUserPosts(userId)
  },

  Mutation : {
     
    CreateUser:( _,{input} ) => {
    const newUser = {
      id: uuid(),
      ...input 
     }
    const userCreate =  users.find(n => n.email === input.email)
     
    if (userCreate) {
      console.log('el usuario es ya creado');
      return
    }
    users.push(newUser)
      return newUser 
    },

    DeleteUser: (_, args) =>{
     
        const userIndex = users.findIndex(n => n.id.toString() === args.id )
        if (userIndex !== -1) {
          users.splice(userIndex, 1)
          
          return { success: true, message: "Usuario eliminado exitosamente." };
        }
        return { success: false, message: "No se encontró ningún usuario con el ID proporcionado." };
     },


     updateUser: (parent, args) => {
      const { id, name } = args;
      const userIndex = users.findIndex(user => user.id.toString() === id);

      if (userIndex !== -1) {
        users[userIndex].name = name;
        return users[userIndex];
      }

      return null;
    },

     Login: (_,args) =>{
      const {email, password} = args
      const user = users.find(user => user.email === email && user.password === password)

      if (!user) {
        throw new Error('crdenciales invalidas')
      }

      const token = Jwt.sign({userId: user.id, name: user.name, avatar: user.avatar}, 'secret',{expiresIn: '1h'})
      return  token
     },

     CreatePost: (_, { title, content, authorId }) =>  createPost(title, content, authorId),

     
  }
};
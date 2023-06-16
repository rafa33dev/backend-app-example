import { users } from "../data/data.js";
import User from "../models/User.js";
import { createPost } from "../SchemaPost/ResolverPost.js";
import Post from "../models/Post.js";
import { login } from "../SchemaPost/ResolveLogin.js";
export const resolvers = {
  Query: {
    GetUsers: async (_, { filter = {} } ) => {
      try {
        console.log(filter);
        const { _id } = filter
        const query = {}

        if(_id) query._id = _id

        const users = await User.find(query).populate('posts')

        return users;
      } catch (error) {
        throw new Error("Error al obtener la lista de usuarios");
      }
    },

    GetUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id).populate('posts')
        return user;
      } catch (error) {
        throw new Error("Error al buscar el usuario");
      }
    },
    GetAllPost: async (_,args) => {
      const {} = args
      try {
        const posts = await Post.find()
        return posts
      } catch (error) {
        throw new Error('Error al obtener la lista de posts');
      }
    },
  },

  Mutation: {
    CreateUser: async (_, { input }) => {
      console.log(input);
      const user = new User({
        ...input,
      });
      await user.save();
      return user;
    },

    DeleteUser: (_, args) => {
      const userIndex = users.findIndex((n) => n.id.toString() === args.id);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);

        return { success: true, message: "Usuario eliminado exitosamente." };
      }
      return {
        success: false,
        message: "No se encontró ningún usuario con el ID proporcionado.",
      };
    },

    updateUser: (parent, args) => {
      const { id, name } = args;
      const userIndex = users.findIndex((user) => user.id.toString() === id);

      if (userIndex !== -1) {
        users[userIndex].name = name;
        return users[userIndex];
      }

      return null;
    },

    Login: (_, {email, password}) => login(email, password),

    CreatePost: (_, { title, content, authorId }) => createPost(title, content, authorId),

  },
};

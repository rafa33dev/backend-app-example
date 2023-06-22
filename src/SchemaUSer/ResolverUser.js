import { users } from "../data/data.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { createPost } from "../SchemaPost/ResolverPost.js";
import Post from "../models/Post.js";
import { login } from "../SchemaPost/ResolveLogin.js";
export const resolvers = {
  Query: {
    GetUsers: async (_, { filter = {} }) => {
      try {
        console.log(filter);
        const { _id } = filter;
        const query = {};

        if (_id) query._id = _id;

        const users = await User.find(query).populate("posts");

        return users;
      } catch (error) {
        throw new Error("Error al obtener la lista de usuarios");
      }
    },

    GetUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id).populate("posts");
        return user;
      } catch (error) {
        throw new Error("Error al buscar el usuario");
      }
    },
    GetAllPost: async () => {
      try {
        const posts = await Post.find()
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .exec();
        return posts;
      } catch (error) {
        throw new Error("Error al obtener la lista de posts");
      }
    },

    Comment: {
      user: async (parent) => await User.findById(parent.userId),
      post: async (parent) => await Post.findOne({ post: parent.postId }),
    },

    Post: {
      user: async (parent) => User.findById(parent.userId),
      comments: async (parent) => Comment.findOne({ comment: parent.id }),
    },

    AdminOnly: async (parent, args, { userId, role }) => {
      if (role !== "admin") {
        throw new Error("no tienes permiso para esta accion");
      }
      return "¡Consulta solo para administradores!";
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

    Login: (_, { email, password }) => login(email, password),

    CreatePost: (_, { title, content, authorId }) =>
      createPost(title, content, authorId),

    DeletePost: async (_, { id }, context) => {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new Error("no se encontro el post ");
        }
        if (post.author !== context) {
          console.log(context);
          throw new Error("No tienes permiso para este post");
        }

        // await post.remove()
        // console.log('qui paso3');

        // return 'Post eliminado'
      } catch (error) {
        throw new Error("Error al eliminar el post");
      }
    },

    CreateComment: async (_, { postId, content, userId }) => {
      console.log(content);
      try {
        const comment = new Comment({
          content,
          postId,
          userId,
        });

        await comment.save();
        return comment;
      } catch (error) {
        console.error("Error al crear el comentario:", error);
        throw new Error("No se pudo crear el comentario", error);
      }
    },
  },
};

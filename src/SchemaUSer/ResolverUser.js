import User from '../models/User.js'
import Comment from '../models/Comment.js'
import { createPost } from '../SchemaPost/ResolverPost.js'
import Post from '../models/Post.js'
import { login } from '../SchemaPost/ResolveLogin.js'
import { PubSub, withFilter } from 'graphql-subscriptions'
const pubsub = new PubSub()
import mongoose from 'mongoose'

export const resolvers = {
  Post: {
    commentCount: (parent) => {
      return parent.comments.length
    },
    comments: async (parent) => {
      try {
        // Recuperar los comentarios relacionados con el post
        const comments = await Comment.find({ _id: { $in: parent.comments } }).populate('author')
        return comments
      } catch (error) {
        console.log('Error al recuperar los comentarios')
        throw error
      }
    },
  },
  Query: {
    GetUsers: async (_, { filter = {} }) => {
      try {
        const { _id } = filter
        const query = {}

        if (_id) query._id = _id

        const users = await User.find(query).populate('posts')

        return users
      } catch (error) {
        throw new Error('Error al obtener la lista de usuarios')
      }
    },

    GetPosts: async () => {
      try {
        const posts = await Post.find().populate('author').populate('comments')
        console.log('mis posts -->', posts)
        return posts
      } catch (error) {
        console.log('Error al consultar los posts')
        throw error
      }
    },

    GetUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id).populate('posts')
        return user
      } catch (error) {
        throw new Error('Error al buscar el usuario')
      }
    },

    Comment: {
      author: async (parent) => {
        // console.log(parent)
        try {
          const authorId = parent.authorId
          const user = await User.findOne({ _id: authorId })
          return user || {} // Devuelve un objeto vacío si no se encuentra el autor
        } catch (error) {
          throw new Error('No se pudo encontrar el usuario asociado al comentario.')
        }
      },
    },

    GetPostComments: async (_, { postId }) => {
      console.log('mi poes id--Z', postId)
      try {
        const commentPost = await Comment.find({ postId: postId })
        console.log('que trajo', commentPost)
        return commentPost
      } catch (error) {
        console.log('no se puedo traer comentario', error.message)
      }
    },
    // Post: async (_, { id }) => {
    //   try {
    //     const post = await Post.findById(id).populate('comments')
    //     return post
    //   } catch (error) {
    //     console.error('Error al obtener el post:', error)
    //     throw new Error('No se pudo obtener el post', error)
    //   }
    //   // if (!post) {
    //   //   throw new Error('no se encunbtra el post')
    //   // }
    // },

    //user: async (parent) => User.findById(parent.userId),
    //comments: async (parent) => await Comment.find({ post: parent.id }),

    AdminOnly: async (parent, args, { userId, role }) => {
      if (role !== 'admin') {
        throw new Error('no tienes permiso para esta accion')
      }
      return '¡Consulta solo para administradores!'
    },
  },
  Mutation: {
    CreateUser: async (_, { input }) => {
      // console.log(input)
      try {
        const newUserId = new mongoose.Types.ObjectId()
        const user = new User({
          _id: newUserId,
          name: input.name,
          role: input.role,
          email: input.email,
          avatar: input.avatar,
          website: input.website,
          password: input.password,
        })
        await user.save()
        return user
      } catch (error) {
        console.log('Error al crear el usuario', error.message)
      }
    },

    Login: (_, { email, password }) => login(email, password),

    DeleteUser: (_, args) => {
      const userIndex = users.findIndex((n) => n.id.toString() === args.id)
      if (userIndex !== -1) {
        users.splice(userIndex, 1)

        return { success: true, message: 'Usuario eliminado exitosamente.' }
      }
      return {
        success: false,
        message: 'No se encontró ningún usuario con el ID proporcionado.',
      }
    },

    updateUser: (parent, args) => {
      const { id, name } = args
      const userIndex = users.findIndex((user) => user.id.toString() === id)

      if (userIndex !== -1) {
        users[userIndex].name = name
        return users[userIndex]
      }

      return null
    },

    CreatePost: async (_, { input }) => {
      try {
        const post = new Post({
          title: input.title,
          content: input.content,
          author: {
            id: input.author.id,
            name: input.author.name,
            avatar: input.author.avatar,
          },
        })

        await post.save()
        pubsub.publish('NEW_POST', { NewPost: post })
        const postCount = await Post.countDocuments()
        console.log('cionatbfo,', postCount);
        pubsub.publish('CountPost', { CountPost: postCount })
        return post
      } catch (error) {
        throw new Error('error al crear el post ', error)
      }
    },

    DeletePost: async (_, { id }, context) => {
      try {
        const post = await Post.findById(id)
        if (!post) {
          throw new Error('no se encontro el post ')
        }
        if (post.author !== context) {
          // console.log(context)
          throw new Error('No tienes permiso para este post')
        }

        // await post.remove()
        // console.log('qui paso3');

        // return 'Post eliminado'
      } catch (error) {
        throw new Error('Error al eliminar el post')
      }
    },

    CreateComment: async (_, { input }) => {
      const post = await Post.findById(input.postId)

      if (!post) {
        throw new Error('Nose encontro el post')
      }

      try {
        const comment = new Comment({ 
          content: input.content,
          postId: input.postId,
          author: {
            id: input.author.id,
            name: input.author.name,
            avatar: input.author.avatar,
          },
        })
        await comment.save()
        post.comments = post.comments.concat(comment)

        // console.log(post.comments)
        await post.save()

        pubsub.publish('NEW_COMMENT', { NewComment: comment })

        return comment
      } catch (error) {
        console.error('Error al crear el comentario:', error)
        throw new Error('No se pudo crear el comentario', error)
      }
    },
  },

  Subscription: {
    NewComment: {
      subscribe: withFilter (
       () => pubsub.asyncIterator(['NEW_COMMENT']),
        (payload, variables) => {
          return payload.NewComment.postId === variables.postId 
        }
      )
    },

    CountPost: {
      subscribe: () => {
        return pubsub.asyncIterator(['CountPost'])
      },
    },

    NewPost: {
      subscribe: () => {
        return pubsub.asyncIterator(['NEW_POST'])
      },
    },
  },
}

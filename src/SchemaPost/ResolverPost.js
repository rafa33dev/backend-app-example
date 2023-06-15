import { posts } from "../data/postUserData.js"
import { users } from "../data/data.js"

 export const createPost = (title, content, authorId) => {

  const author = users.find(user => user.id.toString() === authorId)
  if (!author) {
    throw new Error('el autor no existe')
  }

  const newPost = {id: String(posts.length + 1), title, content, author}
  posts.push(newPost)
  return newPost
}

export const getUserPosts = (userId) => {
  const user = users.find(user => user.id === userId)
  if (!user) {
    throw new Error('usuario no encontrado')
  }

  return posts.filter(post => post.author.id === userId)
}
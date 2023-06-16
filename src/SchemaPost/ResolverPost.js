import Post from "../models/Post.js"
import User from "../models/User.js"

 export const createPost = async (title, content, authorId) => {
   
   
   try {
    const user = await User.findById(authorId)
    if (!user) {
      throw new Error('no se encontro el usuario')
    }

    const post = new Post({
      title,
      content,
      author: user._id,
    })

    await post.save()
    user.posts.push(post)
    await user.save()
    
    
    return post 
  } catch (error) {
    throw new Error('error al crear el post ',error)
  }
 
}


import  mongoose  from "mongoose";


const commentSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },

    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      name: {
        type: String
      },

      avatar: {
        type: String
      }
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },

    
  },
  {
    timestamps:  true,
    versionKey: false
  }
  );

  export default mongoose.model('Comment', commentSchema);
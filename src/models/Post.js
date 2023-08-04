import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required : true
    },

    content : {
      type: String,
      required: true
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

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Post', postSchema);
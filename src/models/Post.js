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
      type: String,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('Post', postSchema);
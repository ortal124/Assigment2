import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  content: string;
  senderId: string;
}

const postSchema: Schema = new Schema({
  content: { type: String, required: true },
  senderId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IPost>('Post', postSchema);
import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface IPost {
  content: string;
  senderId: string;
}

const postSchema: Schema = new Schema({
  content: { type: String, required: true },
  senderId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IPost>('Post', postSchema);
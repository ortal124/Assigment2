import mongoose, { Document, Schema, ObjectId} from 'mongoose';

interface IComment extends Document {
  content: string;
  senderId: string;
  postId: string;
}

const commentSchema: Schema = new Schema({
  content: { type: String, required: true },
  senderId: { type: String, required: true },
  postId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', commentSchema);
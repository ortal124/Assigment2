import Comment from '../models/commentModel';

export const createComment = async (content: string, senderId: string, postId: string) => {
    const newComment = new Comment({ content, senderId, postId });
    return await newComment.save();
};

export const updateComment = async (commentId: string, content: string, senderId: string) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error('Comment not found');
    comment.content = content;
    comment.senderId = senderId;
    return await comment.save();
};

export const getAllComments = async () => {
    return await Comment.find();
};

export const getCommentsByPostId = async (postId: string) => {
    return await Comment.find({ postId });
};

export const deleteComment = async (commentId: string) => {
    await Comment.findByIdAndDelete(commentId);
};
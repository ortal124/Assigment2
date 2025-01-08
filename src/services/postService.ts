import Post from '../models/postModel';

export const createPost = async (content: string, senderId: string) => {
    const newPost = new Post({ content, senderId });
    return await newPost.save();
};

export const getPosts = async () => {
    return await Post.find();
};

export const getPostsBySender = async (senderId: string) => {
    return await Post.find({ senderId });
};

export const getPostById = async (postId: string) => {
    return await Post.findById(postId);
};

export const updatePost = async (postId: string, content: string, senderId: string) => {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    post.content = content;
    post.senderId = senderId;
    return await post.save();
};
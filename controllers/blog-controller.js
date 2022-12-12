import Blog from '../model/Blog';
import User from '../model/User';
import { mongoose } from 'mongoose';

export const getAllBlogs = async (req, res) => {
    let blogs

    try {
        blogs = await Blog.find()
    } catch (error) {
        return console.log(error);
    }
    if(!blogs){
        return res.status(404).json({message: 'No blogs found'})
    }
    return res.status(200).json({blogs})
}

export const addBlog = async (req, res) => {
    const {title, description, image, user} = req.body;
    let existingUser;

    try {
        existingUser = await User.findById(user);
    } catch (error) {
        return console.log(error);
    }
    if(!existingUser){
        return res.status(400).json({message: 'Unable to find user by this id'})
    }

    const blog = new Blog({title, description, image, user})

    try {
       const session = await mongoose.startSession();
        await session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog)
        await existingUser.save({session}); 
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error});
    }

    return res.status(200).json({blog})
}

export const updateBlog = async (req, res) => {
    const blogId = req.params.id
    const {title, description} = req.body;
    let blog;

    try {
        blog = await Blog.findByIdAndUpdate(blogId, {title, description}, {new: true})
    } catch (error) {
        return console.log(error);
    }

    if(!blog){
        return res.status(500).json({message: 'Unble to update blog'})
    }
    return res.status(200).json({blog})
}

export const getById = async (req, res) => {
    const id = req.params.id;
    let blog 

    try {
        blog = await Blog.findById(id);
    }
    catch (error) {
        return console.log(error);
    }

    if(!blog){
        return res.status(404).json({message: 'Blog not found'})
    }
    return res.status(200).json({blog})
}

export const deleteBlog = async (req, res) => {
    const id = req.params.id;
    let blog
    try {
        blog = await Blog.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        return console.log(err);
    }

    if(!blog){
        return res.status(400).json({message: 'Blog not found'})
    }
    return res.status(200).json({message: 'Successfully deleted blog'})
}   

export const getByUserId = async (req, res) => {
    const userId = req.params.id
    let userBlogs;

    try {
        userBlogs = await User.findById(userId).populate("blogs")
    } catch (err) {
        return console.log(err);
    }

    if(!userBlogs){
        return res.status(404).json({message: 'No blogs found'})
    }

    return res.status(200).json({blogs: userBlogs})
}
const blogsRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const middleware = require('../utils/middleware');

// Get all blogs
blogsRouter.get('/', async (request, response, next) => {
  try {
    // All the blogs are listed with the user who wrote them using populate, only username and name shown
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    return response.json(blogs);
  } catch (error) {
    next(error);
  }
});

// Post a blog, middleware is marked as being used
blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      // User is in request-object because userExtractor middleware set it there
      // If said user is missing
      if (!request.user) {
        return response.status(401).json({ error: 'user missing' });
      }
      const user = request.user;
      // Blog information comes from the request body, user id from the user found by userExtractor middleware
      const blog = new Blog({
        ...request.body,
        user: user._id,
      });

      const blogSaved = await blog.save();
      // Posted blogs id is added their list of blogs (non-mutating way)
      user.blogs = user.blogs.concat(blogSaved._id);
      await user.save();
      response.status(201).json(blogSaved);
    } catch (error) {
      next(error);
    }
  }
);

// Delete the given blog
blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      // User is in request-object because userExtractor middleware set it there
      // If said user is missing
      if (!request.user) {
        return response.status(401).json({ error: 'user missing' });
      }
      const user = request.user;
      const blog = await Blog.findById(request.params.id);
      if (!blog) {
        return response.status(404).json({ error: 'blog not found' });
      }
      // If the id linked to the blog doesn't match the user's id, the action is blocked
      if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'not allowed' });
      } else {
        await Blog.findByIdAndDelete(request.params.id);
        return response.status(204).end();
      }
    } catch (error) {
      next(error);
    }
  }
);

// Edit the given blog
blogsRouter.put(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      // User is in request-object because userExtractor middleware set it there
      // If said user is missing
      if (!request.user) {
        return response.status(401).json({ error: 'user missing' });
      }
      const user = request.user;
      const { title, author, url, likes } = request.body;
      const blogToEdit = await Blog.findById(request.params.id);
      if (!blogToEdit) {
        response.status(404).json({ error: 'blog not found' });
      }
      // If the id linked to the blog doesn't match the user's id, the action is blocked
      if (blogToEdit.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'not allowed' });
      } else {
        blogToEdit.title = title;
        blogToEdit.author = author;
        blogToEdit.url = url;
        blogToEdit.likes = likes;

        const updatedBlog = await blogToEdit.save();
        response.status(200).json(updatedBlog);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = blogsRouter;

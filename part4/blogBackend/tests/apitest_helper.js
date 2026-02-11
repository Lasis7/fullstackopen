const Blog = require('../models/Blog');
const User = require('../models/User');

const initialBlogs = [
  {
    title: 'yeah',
    author: 'James',
    url: 'http://www.jamesyeah.com',
    likes: 7,
  },
  {
    title: 'my computer is broken',
    author: 'Alan',
    url: 'http://www.crappypc.org',
    likes: 7,
  },
];

async function blogsInDb() {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
}

async function usersInDb() {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
}

module.exports = { initialBlogs, blogsInDb, usersInDb };

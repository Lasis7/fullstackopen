const assert = require('node:assert');
const { test, describe, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/Blog');
const helper = require('./apitest_helper');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogs = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogs.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('Get all blogs', async () => {
  test('Correct amount of JSON-format blogs are returned', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length);
  });

  test('Identifying part of the blogs is called id', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const blogs = await helper.blogsInDb();
    blogs.forEach((blog) => {
      assert.strictEqual(blog.hasOwnProperty('id'), true);
      assert.strictEqual(blog.hasOwnProperty('_id'), false);
    });
  });
});

describe('posting a new blog', async () => {
  let token;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const newUser = new User({ username: 'root', passwordHash });
    await newUser.save();

    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usernameFound = users.body[0].username;
    const user = await User.findOne({ username: usernameFound });

    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = response.body.token;
  });

  test('increases the number of blogs by one', async () => {
    const testBlog = {
      title: 'How to code',
      author: 'Mr coder',
      url: 'https://coding123.com',
      likes: 70,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map((blog) => blog.title);

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

    assert(titles.includes('How to code'));
  });

  test('When likes not given, it is set to 0', async () => {
    const testBlog = {
      title: 'unnamed book',
      author: 'Sven Johnson',
      url: 'https://bookswithoutnames.com',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const specificBlog = response.body.find(
      (blog) => blog.title === 'unnamed book'
    );
    assert.strictEqual(specificBlog.likes, 0);
  });

  test('when no title or url given, give an error', async () => {
    const testBlogs = [
      {
        author: 'testman1',
        url: 'https://testman1.com',
        likes: 1,
      },
      {
        title: 'The life of testman2',
        author: 'testman2',
        likes: 2,
      },
      {
        author: 'testman3',
        likes: 3,
      },
    ];
    for (const blog of testBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    }
  });
});

describe('deleting a blog', async () => {
  let token;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const newUser = new User({ username: 'root', passwordHash });
    await newUser.save();

    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usernameFound = users.body[0].username;
    const user = await User.findOne({ username: usernameFound });

    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = response.body.token;
  });
  test('blog deletion works', async () => {
    const notes = await helper.blogsInDb();
    const noteToDelete = notes[0];
    await api.delete(`/api/blogs/${noteToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    const ids = blogsAtEnd.map((note) => note.id);

    assert(!ids.includes(blogToDelete.id));
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

describe('editing a blog', async () => {
  let token;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const newUser = new User({ username: 'root', passwordHash });
    await newUser.save();

    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usernameFound = users.body[0].username;
    const user = await User.findOne({ username: usernameFound });

    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = response.body.token;
  });
  test('blog editing works', async () => {
    const updatedBlog = {
      title: 'yes',
      author: 'Jameson',
      url: 'http://www.jamesonyeah.com',
      likes: 10,
    };
    const blogs = await helper.blogsInDb();
    const blogToChange = blogs[0];
    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const changedBlog = blogsAtEnd.body[0];
    assert.strictEqual(changedBlog.title, updatedBlog.title);
  });
});

after(async () => {
  await mongoose.connection.close();
});

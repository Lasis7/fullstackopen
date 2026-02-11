const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const supertest = require('supertest');
const assert = require('node:assert');
const { beforeEach, describe, test, after } = require('node:test');
const helper = require('./apitest_helper');
const app = require('../app');

const api = supertest(app);

describe('When there is initially one user at db', async () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtFirst = await helper.usersInDb();
    const newUser = {
      username: 'testUser',
      name: 'Miguel Jakeson',
      password: 'securepassword123',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtFirst.length + 1);
    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes(newUser.username));
  });

  test('using taken username leads to proper statuscode and message', async () => {
    const usersAtFirst = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'rootuser',
      password: 'rootpassword',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));
    assert.strictEqual(usersAtFirst.lenght, usersAtEnd.lenght);
  });
});

describe('When a user is created', async () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('if the username or the password is too short, a proper statuscode and an error message is presented', async () => {
    const newUser = {
      username: 'aaaa',
      name: 'eeeee',
      password: 'c',
    };

    const usersAtFirst = await helper.usersInDb();

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        'username and password need to be at least 3 digits long'
      )
    );
    assert.strictEqual(usersAtFirst.length, usersAtEnd.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});

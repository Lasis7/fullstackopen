const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns 1', () => {
  const blogs = [];
  assert.strictEqual(listHelper.dummy(blogs), 1);
});

describe('total likes', () => {
  test('of an empty list is 0', () => {
    const emptyList = [];
    assert.strictEqual(listHelper.totalLikes(emptyList), 0);
  });

  test('of a list with only one blog, the likes equal of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
      },
    ];
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5);
  });

  test('of a list with multiple blogs, the likes count is correct', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
      },
      {
        _id: 'rhtdtyjsrshrtsjsy',
        title: 'Go To a',
        author: 'Edgar a',
        url: 'http://www.u.arizona.edu/~edgarman/copyright_violations/gotoa.html',
        likes: 15,
        __v: 0,
      },
    ];
    assert.strictEqual(listHelper.totalLikes(listWithMultipleBlogs), 20);
  });
});

describe('favourite blog', () => {
  test('with most likes', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
      },
      {
        _id: 'rhtdtyjsrshrtsjsy',
        title: 'Go To a',
        author: 'Edgar a',
        url: 'http://www.u.arizona.edu/~edgarman/copyright_violations/gotoa.html',
        likes: 15,
        __v: 0,
      },
    ];
    assert.deepStrictEqual(
      listHelper.favouriteBlog(listWithMultipleBlogs),
      listWithMultipleBlogs[1]
    );
  });
});

describe('blogger with', () => {
  test('most blogs', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
      },
      {
        _id: 'rhtdtyjsrshrtsjsy',
        title: 'Go To a',
        author: 'Edgar a',
        url: 'http://www.u.arizona.edu/~edgarman/copyright_violations/gotoa.html',
        likes: 15,
        __v: 0,
      },
      {
        _id: '5a422aa7fwewewfewew',
        title: 'abcd hhhhhhh',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/banana.html',
        likes: 5,
        __v: 0,
      },
    ];
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'Edsger W. Dijkstra',
      blogs: 2,
    });
  });
});

describe('blogger with', () => {
  test('most likes', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
      },
      {
        _id: 'rhtdtyjsrshrtsjsy',
        title: 'Go To a',
        author: 'Edgar a',
        url: 'http://www.u.arizona.edu/~edgarman/copyright_violations/gotoa.html',
        likes: 15,
        __v: 0,
      },
      {
        _id: '5a422aa7fwewewfewew',
        title: 'abcd hhhhhhh',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/banana.html',
        likes: 5,
        __v: 0,
      },
      {
        _id: '5a422aa7fwewewfewew',
        title: 'abcd hhhhhhh',
        author: 'Edsger W. Di',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/banana.html',
        likes: 7,
        __v: 0,
      },
    ];
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: 'Edgar a',
      likes: 15,
    });
  });
});

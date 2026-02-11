const _ = require('lodash');

function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  if (totalLikes.length === 0) {
    return 0;
  } else {
    let total = 0;
    blogs.forEach((blog) => {
      total += blog.likes;
    });
    return total;
  }
}

function favouriteBlog(blogs) {
  const copy = blogs.slice();
  copy.sort((a, b) => b.likes - a.likes);
  return copy[0];
}

function mostBlogs(blogs) {
  const blogsCounted = _.countBy(blogs, 'author');
  const blogsSorted = Object.fromEntries(
    Object.entries(blogsCounted).sort(([, a], [, b]) => b - a)
  );
  const result = {
    author: Object.keys(blogsSorted)[0],
    blogs: Object.values(blogsSorted)[0],
  };
  return result;
}

function mostLikes(blogs) {
  const blogsGrouped = _.groupBy(blogs, 'author');
  const likes = [];
  // console.log(Object.values(blogsGrouped));
  for (let [keys, values] of Object.entries(blogsGrouped)) {
    for (let blog of values) {
      likes.push({ author: keys, likes: blog.likes });
    }
  }
  const likesGrouped = _.groupBy(likes, 'author');
  const likesSummed = _.map(likesGrouped, (likes, author) => ({
    author: author,
    likes: _.sumBy(likes, 'likes'),
  }));
  const mostLikes = _.maxBy(likesSummed, 'likes');
  return mostLikes;
}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };

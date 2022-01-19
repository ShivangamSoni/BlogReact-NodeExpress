const getLatestByUser = (userId, BLOGS) => {
  const latestBlogs = BLOGS.filter((blog) => blog.authorId == userId);
  return latestBlogs;
};

module.exports = getLatestByUser;

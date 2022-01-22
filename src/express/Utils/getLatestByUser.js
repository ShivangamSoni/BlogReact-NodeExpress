const getLatestByUser = (userId, BLOGS) => {
  const latestBlogs = BLOGS.filter((blog) => blog.authorId == userId).map((blog) => ({
    title: blog.title,
    id: blog.id,
    category: blog.category,
    creationTime: blog.creationTime,
    content: blog.content.slice(0, 3),
    upVotes: blog.upVotes,
  }));
  return latestBlogs;
};

module.exports = getLatestByUser;

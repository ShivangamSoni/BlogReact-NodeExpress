const verifyUsername = (username, Users) => {
  const user = Users.filter((user) => user.username === username);

  if (user.length !== 0) {
    return { success: false, message: "Username Already Registered" };
  }

  return { success: true, message: "Username Available" };
};

module.exports = verifyUsername;

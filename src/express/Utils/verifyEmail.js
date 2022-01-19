const verifyEmail = (email, Users) => {
  const user = Users.filter((user) => user.email === email);

  if (user.length !== 0) {
    return { success: false, message: "Email Already Registered" };
  }

  return { success: true, message: "Email Available" };
};

module.exports = verifyEmail;

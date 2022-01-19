const JWT_Secrete_Key = "CF65A54D5EBD8FEA9E86712B9EF61";

const JWT_Config = {
  expiresIn: 60 * 15,
};

const SALT_ROUNDS = 10;

const CORS_Config = {
  origin: "https://shivi-blog-node.herokuapp.com/api/v1/blogs",
};

module.exports = {
  JWT_Secrete_Key,
  JWT_Config,
  SALT_ROUNDS,
  CORS_Config,
};

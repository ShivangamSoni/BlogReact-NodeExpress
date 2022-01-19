const bodyRequired = (req, res, next) => {
  const body = req.body;

  if (Object.keys(body).length === 0) {
    res.status(400).json({ success: false, message: "Missing Request Body" });
    return;
  }

  next();
};

module.exports = bodyRequired;

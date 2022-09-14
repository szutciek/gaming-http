const errorSender = (err, req, res, next) => {
  console.log(err);
  if (err.userCaused === true) {
    res.status(err.statusCode || 500).json({
      status: err.status || "fail",
      message: err.message || "Internal Server Error",
    });
  } else {
    res.status(err.statusCode || 500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = errorSender;

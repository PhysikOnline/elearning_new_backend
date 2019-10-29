function errorHandling(error, req, res, next) {
  console.error(error);
  if (error.MS) {
    res.send({ error: error.MS });
  } else {
    res.send({ error: "something went wrong, pleas contect the maintainer!" });
  }
}

module.exports = errorHandling;

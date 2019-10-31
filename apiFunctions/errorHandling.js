function errorHandling(error, req, res, next) {
  // log error to server console for general error logging
  console.error(error);
  // check if a custom message is defined
  if (error.MS) {
    // respond with custom error message
    res.send({ error: error.MS });
  } else {
    // in no custom error message was defined, respond with normal error message
    // this should be a fallback solution
    res.send({ error: error.message });
  }
}

module.exports = errorHandling;

function pdf(error) {
  // errors for GroupTimerColumn
  if (error.message.includes("GroupTimer")) {
    error.MS = ERROR.GroupTimer[error.code];
    return error;
  }
  // error response if non of the above errors match
  return error;
}

// define additional error responses
const ERROR = {
  GroupTimer: {
    ER_TRUNCATED_WRONG_VALUE: {
      GroupTimer: "has wrong date format"
    }
  }
};

module.exports = pdf;

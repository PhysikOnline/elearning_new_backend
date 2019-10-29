function groupTimer(error) {
  if (error.message.includes("GroupTimer")) {
    error.MS = ERROR.GroupTimer[error.code];
    return error;
  }
}

const ERROR = {
  GroupTimer: {
    ER_TRUNCATED_WRONG_VALUE: {
      GroupTimer: "has wrong date format"
    }
  }
};

module.exports = groupTimer;

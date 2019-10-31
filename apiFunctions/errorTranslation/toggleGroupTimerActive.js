function toggleGroupTimerActive(error) {
  // errors for column GroupTimerActive
  if (error.message.includes("GroupTimerActive")) {
    error.MS = ERROR.GroupTimerActive[error.code];
    return error;
  }
  // error response if non of the above errors match
  return error;
}

// define additional error responses
const ERROR = {
  GroupTimerActive: {
    UNKNOWN_CODE_PLEASE_REPORT: {
      GroupTimerActive: "did not changed because GroupVisibility was 1"
    }
  }
};

module.exports = toggleGroupTimerActive;

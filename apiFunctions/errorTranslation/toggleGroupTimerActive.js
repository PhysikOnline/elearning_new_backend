function toggleGroupTimerActive(error) {
  if (error.message.includes("GroupTimerActive")) {
    error.MS = ERROR.GroupTimerActive[error.code];
    return error;
  }
  return error;
}

const ERROR = {
  GroupTimerActive: {
    UNKNOWN_CODE_PLEASE_REPORT: {
      GroupTimerActive: "did not changed because GroupVisibility was 1"
    }
  }
};

module.exports = toggleGroupTimerActive;

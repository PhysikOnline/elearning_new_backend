function toogleGroupVisibility(error) {
  // errors for column GroupVisible
  if (error.message.includes("GroupVisible")) {
    error.MS = ERROR.GroupVisible[error.code];
    return error;
  }
  // error response if non of the above errors match
  return error;
}

// define additional error responses
const ERROR = {
  GroupVisible: {
    UNKNOWN_CODE_PLEASE_REPORT: {
      GroupVisible: "did not changed because GroupTimerActive was 1"
    }
  }
};

module.exports = toogleGroupVisibility;

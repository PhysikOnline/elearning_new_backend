function toogleGroupVisibility(error) {
  if (error.message.includes("GroupVisible")) {
    error.MS = ERROR.GroupVisible[error.code];
    return error;
  }
  return error;
}

const ERROR = {
  GroupVisible: {
    UNKNOWN_CODE_PLEASE_REPORT: {
      GroupVisible: "did not changed because GroupTimerActive was 1"
    }
  }
};

module.exports = toogleGroupVisibility;

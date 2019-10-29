function errorTranslation_insertorupdategroup(error) {
  if (error.message.includes("GroupName")) {
    error.MS = GroupNameError[error.code];
    return error;
  }
  if (error.message.includes("Tutor")) {
    error.MS = TutorError[error.code];
    return error;
  }
  if (error.message.includes("Starttime")) {
    error.MS = StarttimeError[error.code];
    return error;
  }
  if (error.message.includes("Endtime")) {
    error.MS = EndtimeError[error.code];
    return error;
  }
  if (error.message.includes("Weekday")) {
    error.MS = WeekdayError[error.code];
    return error;
  }
}

const WeekdayError = {
  ER_DATA_TOO_LONG: {
    Weekday: "is too long"
  },
  UNKNOWN_CODE_PLEASE_REPORT: {
    Weekday: 'has to be "Mo", "Di", "Mi", "Do", "Fr"'
  }
};

const EndtimeError = {
  ER_TRUNCATED_WRONG_VALUE: {
    Endtime: "wrong value"
  },
  UNKNOWN_CODE_PLEASE_REPORT: {
    Endtime: "out of boundaries"
  }
};

const StarttimeError = {
  ER_TRUNCATED_WRONG_VALUE: {
    Starttime: "wrong value"
  },
  UNKNOWN_CODE_PLEASE_REPORT: {
    Starttime: "out of boundaries"
  }
};

const GroupNameError = {
  ER_BAD_NULL_ERROR: {
    GroupName: "must be defined"
  },
  UNKNOWN_CODE_PLEASE_REPORT: {
    GroupName: "has wrong format"
  }
};

const TutorError = {
  ER_DATA_TOO_LONG: {
    Tutor: "login is too long"
  },
  ER_NO_REFERENCED_ROW_2: {
    Tutor: "does not exist"
  }
};

module.exports = errorTranslation_insertorupdategroup;

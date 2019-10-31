function insertOrUpdateGroup(error) {
  // errors for duplicate key entries, that occurs if a group already exists
  if (error.message.includes("ER_DUP_ENTRY")) {
    error.MS = ERROR.GroupNameError[error.code];
    return error;
  }
  // errors for column GroupName
  if (error.message.includes("GroupName")) {
    error.MS = ERROR.GroupNameError[error.code];
    return error;
  }

  // errors for column Tutor
  if (error.message.includes("Tutor")) {
    error.MS = ERROR.TutorError[error.code];
    return error;
  }
  // errors for column Starttime
  if (error.message.includes("Starttime")) {
    error.MS = ERROR.StarttimeError[error.code];
    return error;
  }
  // errors for column Endtime
  if (error.message.includes("Endtime")) {
    error.MS = ERROR.EndtimeError[error.code];
    return error;
  }
  // errors for column Weekday
  if (error.message.includes("Weekday")) {
    error.MS = ERROR.WeekdayError[error.code];
    return error;
  }
  // errors for column Custom error messages
  if (error.message.includes("ER_SIGNAL_EXCEPTION")) {
    error.MS = ERROR.MaxUserError[error.code];
    return error;
  }
  // error response if non of the above errors match
  return error;
}

// define additional error responses
const ERROR = {
  WeekdayError: {
    ER_DATA_TOO_LONG: {
      Weekday: "is too long"
    },
    UNKNOWN_CODE_PLEASE_REPORT: {
      Weekday: 'has to be "Mo", "Di", "Mi", "Do", "Fr"'
    }
  },

  EndtimeError: {
    ER_TRUNCATED_WRONG_VALUE: {
      Endtime: "wrong value"
    },
    UNKNOWN_CODE_PLEASE_REPORT: {
      Endtime: "out of boundaries"
    }
  },

  StarttimeError: {
    ER_TRUNCATED_WRONG_VALUE: {
      Starttime: "wrong value"
    },
    UNKNOWN_CODE_PLEASE_REPORT: {
      Starttime: "out of boundaries"
    }
  },

  GroupNameError: {
    ER_DUP_ENTRY: {
      GroupName: "already exists"
    },
    ER_BAD_NULL_ERROR: {
      GroupName: "must be defined"
    },
    UNKNOWN_CODE_PLEASE_REPORT: {
      GroupName: "has wrong format"
    },
    ER_DATA_TOO_LONG: {
      GroupName: "is too long"
    }
  },

  TutorError: {
    ER_DATA_TOO_LONG: {
      Tutor: "login is too long"
    },
    ER_NO_REFERENCED_ROW_2: {
      Tutor: "does not exist"
    }
  },
  MaxUserError: {
    ER_SIGNAL_EXCEPTION: {
      MaxUser: "cannot be decreased"
    }
  }
};

module.exports = insertOrUpdateGroup;

function joinGroup(error) {
  // error for duplicate key entry, this usually occurs if a user is already in
  // a group in the semester
  if (error.message.includes("ER_DUP_ENTRY")) {
    error.MS = {
      User: "already in Group"
    };
    return error;
  }
  // Group is Fll error
  if (error.message.includes("Group is Full")) {
    error.MS = {
      Group: "is Full"
    };
    return error;
  }
  // User has not he 'user' Course permission
  if (error.message.includes("only users can be in Groups")) {
    error.MS = {
      Group: "can just be joined by course users"
    };
    return error;
  }
  // error for no reference in Groups. This means the Group does not exist
  if (error.message.includes("ER_NO_REFERENCED_ROW_2")) {
    error.MS = {
      Group: "not found"
    };
    return error;
  }
  // errors for column GroupName
  if (error.message.includes("GroupName")) {
    error.MS = ERROR.GroupNameError[error.code];
    return error;
  }
  // errors for column CourseName
  if (error.message.includes("CourseName")) {
    error.MS = ERROR.CourseNameError[error.code];
    return error;
  }
  // errors for column Semester
  if (error.message.includes("Semester")) {
    error.MS = ERROR.SemesterError[error.code];
    return error;
  }
  // errors for column Login
  if (error.message.includes("Login")) {
    error.MS = ERROR.LoginError[error.code];
    return error;
  }
  // error response if non of the above errors match
  return error;
}

// define additional error responses
const ERROR = {
  CourseNameError: {
    ER_DATA_TOO_LONG: {
      CourseName: "is too long"
    },
    ER_BAD_NULL_ERROR: {
      CourseName: "cannot be null"
    }
  },
  SemesterError: {
    ER_DATA_TOO_LONG: {
      Semester: "is too long"
    },
    ER_BAD_NULL_ERROR: {
      Semester: "cannot be null"
    }
  },
  GroupNameError: {
    ER_DATA_TOO_LONG: {
      GroupName: "is too long"
    },
    ER_BAD_NULL_ERROR: {
      GroupName: "cannot be null"
    }
  },
  LoginError: {
    ER_BAD_NULL_ERROR: {
      User: "not logged in"
    }
  }
};

module.exports = joinGroup;

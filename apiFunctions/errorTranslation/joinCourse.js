function joinCourse(error) {
  // errors for GroupTimerColumn
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    error.MS = { Kurs: "nicht gefunden" };
    return error;
  }
  if (error.message.includes("Duplicate entry")) {
    error.MS = { User: "ist bereits im Kurs" };
    return error;
  }
  if (error.message.includes("Semester")) {
    error.MS = ERROR.Semester[error.code];
    return error;
  }
  if (error.message.includes("Name")) {
    error.MS = ERROR.Course[error.code];
    return error;
  }
  // error response if non of the above errors match
  return error;
}

// define additional error responses
const ERROR = {
  Semester: {
    ER_DATA_TOO_LONG: {
      Semester: "is to Long"
    }
  },
  Course: {
    ER_DATA_TOO_LONG: {
      Course: "is to Long"
    }
  }
};

module.exports = joinCourse;

var sql = require("../db/db");

function getCoursePermission(Semester, Name, Username, callback) {
  sql.query(
    // get course permissions
    "SELECT Permissions FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
    [Semester, Name, Username],
    function(error, results, fields) {
      // error handling
      if (error) throw error;
      // check if a user is logged in
      if (results.length === 1) {
        callback(results[0].Permissions);
      } else {
        sql.query(
          "SELECT * FROM `Groups` WHERE `Semester` = ? AND `CourseName` = ? AND `Tutor` = ?",
          [Semester, Name, Username],
          function(errorGroup, resultsGroup, fieldsGroup) {
            if (errorGroup) throw errorGroup;
            // check if a user is logged in
            if (resultsGroup.length === 1) {
              callback("tutor");
            } else {
              callback("");
            }
          }
        );
      }
    }
  );
}

module.exports = getCoursePermission;

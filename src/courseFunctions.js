var sql = require("../db/db");

function getCoursePermission(Semester, Name, Username, callback) {
  sql.query(
    // get course permissions
    "SELECT Permissions FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
    [Semester, Name, Username],
    function(error, results, fields) {
      // error handling
      if (error) throw error;
      // check if a user has permissions on a Course
      if (results.length === 1) {
        // respond with Course permission
        callback(results[0].Permissions);
      } else {
        sql.query(
          // check if user is tutor in one of the groups
          "SELECT * FROM `Groups` WHERE `Semester` = ? AND `CourseName` = ? AND `Tutor` = ?",
          [Semester, Name, Username],
          function(errorGroup, resultsGroup, fieldsGroup) {
            // error handling
            if (errorGroup) throw errorGroup;
            // check if a user is user in one or multiple groups
            if (resultsGroup.length === 0) {
              // respond with no user
              callback("");
            } else {
              // respond with tutor permission
              callback("tutor");
            }
          }
        );
      }
    }
  );
}

module.exports = getCoursePermission;

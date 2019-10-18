var express = require("express");
var router = express.Router();
var sql = require("../db/db");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

router.post("/insertdescription", function(req, res) {
  sql.query(
    "SELECT Permissions FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
    [req.query.Semester, req.query.Name, req.session.username],
    function(error, results, fields) {
      if (error) throw error;
      if (results.length === 0) {
        res.status(200).send("ERROR: No Course with Assigned User found");
      } else if (results[0].Permissions === "admin") {
        sql.query(
          "UPDATE `Course` SET `Description` = ? WHERE `Semester` = ? and `Name` = ?",
          [req.query.Description, req.query.Semester, req.query.Name],
          function(errorUpdate, resultsUpdate, fieldsUpdate) {
            if (errorUpdate) throw errorUpdate;
            res.status(200).send("Sucsessfull");
          }
        );
      } else {
        res.status(200).send("Wrong permissions");
      }
    }
  );
});

router.get("/coursecontent", function(req, res) {
  sql.query(
    // fetch course data
    "SELECT `Semester`, `Name`, `Description` FROM `Course` WHERE `Semester` = ? AND `Name` = ?",
    [req.query.Semester, req.query.Name],
    function(error, results, fields) {
      if (error) throw error;
      if (results.length === 0) {
        res.status(200).send({ error: "No course found" });
      } else {
        course = results[0];
        // fetch permissions
        sql.query(
          "SELECT `Permissions` FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
          [req.query.Semester, req.query.Name, req.session.username],
          function(errorPermissions, resultsPermissions, fieldsPermissions) {
            if (errorPermissions) throw errorPermissions;
            if (resultsPermissions.length === 0) {
              course.auth = [];
              res.status(200).send(course);
            } else {
              switch (resultsPermissions[0].Permissions) {
                case "admin":
                  course.auth = ["user", "admin"];
                  break;
                case "user":
                  course.auth = ["user"];
                  break;
                default:
                  break;
              }
              res.status(200).send(course);
            }
          }
        );
      }
    }
  );
});

router.get("/allcourses", function(req, res) {
  sql.query(
    "SELECT C.Semester, C.Name FROM Course C, Semester S WHERE C.Semester = S.Semester ORDER BY S.Ordering DESC",
    function(error, results, fields) {
      if (error) throw error;
      var regroupedCourses = [];
      results.forEach(course => {
        var lastElement = regroupedCourses.pop();
        if (lastElement) {
          if (lastElement.Semester === course.Semester) {
            lastElement.Name.push(course.Name);
            regroupedCourses.push(lastElement);
          } else {
            regroupedCourses.push(lastElement);
            regroupedCourses.push({
              Semester: course.Semester,
              Name: [course.Name]
            });
          }
        } else {
          regroupedCourses.push({
            Semester: course.Semester,
            Name: [course.Name]
          });
        }
      });

      res.status(200).send(regroupedCourses);
    }
  );
});

module.exports = router;

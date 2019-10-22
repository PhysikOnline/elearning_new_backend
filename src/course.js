var express = require("express");
var router = express.Router();
var sql = require("../db/db");

var group = require("./group");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

/**
 * function to change the descripotion of the course
 */
router.post("/insertdescription", function(req, res) {
  sql.query(
    // get course permissions
    "SELECT Permissions FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
    [req.query.Semester, req.query.Name, req.session.username],
    function(error, results, fields) {
      // error handling
      if (error) throw error;
      // check if a user is logged in
      if (results.length === 0) {
        // respond with no user beeing logged in
        res.status(200).send("ERROR: No Course with Assigned User found");
        // chekc if the logged in user hast admin permissions
      } else if (results[0].Permissions === "admin") {
        sql.query(
          // save the new description to the database
          "UPDATE `Course` SET `Description` = ? WHERE `Semester` = ? and `Name` = ?",
          [req.query.Description, req.query.Semester, req.query.Name],
          function(errorUpdate, resultsUpdate, fieldsUpdate) {
            // error handling
            if (errorUpdate) throw errorUpdate;
            // respond with a sucsessful description change
            res.status(200).send("Sucsessfull");
          }
        );
      } else {
        // repond with having the wrong permissions
        res.status(200).send("Wrong permissions");
      }
    }
  );
});

/**
 * function for returning the course content, this function should not return
 * sesitive information about the course
 */
router.get("/coursecontent", function(req, res) {
  sql.query(
    // fetch the course data
    "SELECT `Semester`, `Name`, `Description`, `GroupVisible`, `GroupTimerActive`, `GroupTimer` FROM `Course` WHERE `Semester` = ? AND `Name` = ?",
    [req.query.Semester, req.query.Name],
    function(error, results, fields) {
      // error handling
      if (error) throw error;
      // check if a course was found
      if (results.length === 0) {
        /* respond, that no cours was found. In this case, it is an object, this
        is easyer to handle in the frontend we attach an .auth to the response
        wich contains an array of the permission a user has an the permissions a
        user inherits */
        res.status(200).send({ error: "No course found" });
      } else {
        // store the results in an extra varriable
        let course = results[0];
        /* fetch the user permissions, this is to handle the content in the 
        frontend */
        sql.query(
          // fetch the user permissions
          "SELECT `Permissions` FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
          [req.query.Semester, req.query.Name, req.session.username],
          function(errorPermissions, resultsPermissions, fieldsPermissions) {
            // error handling
            if (errorPermissions) throw errorPermissions;
            // check if the user has any permissions in the course
            if (resultsPermissions.length === 0) {
              // attach, an empty array to the response, wich means no permissions
              course.auth = [];
              // response with the course content
              res.status(200).send(course);
            } else {
              // conditions to check for attaching the inherited permissions
              switch (resultsPermissions[0].Permissions) {
                case "admin":
                  // add user permissions to the admin
                  course.auth = ["user", "admin"];
                  break;
                case "user":
                  // keep user permissions
                  course.auth = ["user"];
                  break;
                default:
                  break;
              }
              // response with the user and the permissions
              res.status(200).send(course);
            }
          }
        );
      }
    }
  );
});

/**
 * lisa, you need to document this xD
 */
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

router.use("/group", group);

module.exports = router;

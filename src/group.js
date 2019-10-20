var express = require("express");
var router = express.Router();
var sql = require("../db/db");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

/**
 * function to toggle the group visibility of the group assignment
 */
router.post("/tooglegroupvisibility", function(req, res) {
  sql.query(
    // check permissions of the course
    "SELECT Permissions FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
    [req.query.Semester, req.query.Name, req.session.username],
    function(error, results, fields) {
      // error handling
      if (error) throw error;
      // check if a user has any permissions to the course
      if (results.length === 0) {
        // respond with no assigned permissions
        res.status(200).send("ERROR: No Course with Assigned User found");
        // chekc if the user has admin permission on the course
      } else if (results[0].Permissions === "admin") {
        sql.query(
          /* toggle the group visibility on th course, keep in mind, that
          GroupTimerActive and GroupVisibility are coneccted with an NAND 
          operator */
          "UPDATE `Course` SET `GroupVisible` = !`GroupVisible` WHERE `Name` = ? AND `Semester` = ? AND `GroupTimerActive` = 0",
          [req.query.Name, req.query.Semester],
          function(errorUpdate, resultsUpdate, fieldsUpdate) {
            // error handling
            if (errorUpdate) throw errorUpdate;
            /* respond that the groupVisibility got toggled if GroupTimerActive 
            was 0 */
            res.status(200).send("Sucsessfull If GroupTimerActive was 0");
          }
        );
      } else {
        // respond, that the user has the wrong permissions
        res.status(200).send("Wrong permissions");
      }
    }
  );
});

/**
 * function to toggle the group timer active of the group assignment
 */
router.post("/tooglegrouptimeractive", function(req, res) {
  sql.query(
    // check permissions of the course
    "SELECT Permissions FROM `CoursePermissions` WHERE `Semester` = ? AND `Name` = ? AND `Login` = ?",
    [req.query.Semester, req.query.Name, req.session.username],
    function(error, results, fields) {
      // error handling
      if (error) throw error;
      // check if a user has any permissions to the course
      if (results.length === 0) {
        // respond with no assigned permissions
        res.status(200).send("ERROR: No Course with Assigned User found");
        // chekc if the user has admin permission on the course
      } else if (results[0].Permissions === "admin") {
        sql.query(
          /* toggle the group timer active on th course, keep in mind, that
          GroupTimerActive and GroupVisibility are coneccted with an NAND 
          operator */
          "UPDATE `Course` SET `GroupTimerActive` = !`GroupTimerActive` WHERE `Name` = ? AND `Semester` = ? AND `GroupVisible` = 0",
          [req.query.Name, req.query.Semester],
          function(errorUpdate, resultsUpdate, fieldsUpdate) {
            // error handling
            if (errorUpdate) throw errorUpdate;
            /* respond that the groupVisibility got toggled if GroupTimerActive 
            was 0 */
            res.status(200).send("Sucsessfull If GroupVisible was 0");
          }
        );
      } else {
        // respond, that the user has the wrong permissions
        res.status(200).send("Wrong permissions");
      }
    }
  );
});

module.exports = router;

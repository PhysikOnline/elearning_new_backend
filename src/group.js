var express = require("express");
var router = express.Router();
var sql = require("../db/db");
var permission = require("./courseFunctions");
var errorTranslation = require("../apiFunctions/errorTranslation");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

router.post("/insertorupdategroup", function(req, res, next) {
  permission(
    req.query.Semester,
    req.query.CourseName,
    req.session.username,
    function(perm) {
      if (perm === "admin") {
        // res.status(200).send("adminosi");
        sql.query(
          "INSERT INTO `Groups` (`CourseName`, `Semester`, `GroupName`, `Tutor`, `Starttime`, `Weekday`, `Endtime`, `Maxuser`, `Room`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `GroupName` = ?, `Tutor` = VALUES(`Tutor`), `Starttime` = VALUES(`Starttime`), `Weekday` = VALUES(`Weekday`), `Endtime` = VALUES(`Endtime`), `Maxuser` = VALUES(`Maxuser`), `Room` = VALUES(`Room`)",
          [
            req.query.CourseName,
            req.query.Semester,
            req.query.OldGroupName,
            req.query.Tutor,
            req.query.Starttime,
            req.query.Weekday,
            req.query.Endtime,
            req.query.MaxUser,
            req.query.Room,
            req.query.GroupName
          ],
          function(error, results, fields) {
            if (error) return next(errorTranslation(error));
          }
        );
      } else {
        next(new Error("wrong permissions"));
      }
    }
  );
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

router.post("/grouptimer", function(req, res) {
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
          /* Insert the new course time into the database */
          "UPDATE `Course` SET `GroupTimer` = ? WHERE `Name` = ? AND `Semester` = ?",
          [req.query.Time, req.query.Name, req.query.Semester],
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

router.get("/groupcontent", function(req, res) {
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
      } else if (
        results[0].Permissions === "admin" ||
        results[0].Permissions === "user"
      ) {
        sql.query(
          /* Select groups from database */
          "SELECT `GroupName`, `Tutor`, `Ordering`,`Starttime`, `Endtime`, `Weekday`, `Maxuser`, `Room` FROM `Groups` WHERE `CourseName` = ? AND `Semester` = ?",
          [req.query.Name, req.query.Semester],
          function(errorGroups, resultsGroups, fieldsGroups) {
            // error handling
            if (errorGroups) throw errorGroups;
            // send the groups to the clouennt
            res.status(200).send(resultsGroups);
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

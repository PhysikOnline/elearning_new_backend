var express = require("express");
var router = express.Router();
var sql = require("../db/db");
var permission = require("./courseFunctions");
var errorTranslation = require("../apiFunctions/errorTranslation");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

/**
 * function for joining a group in a group assignment
 */
router.post("/joingroup", function(req, res, next) {
  sql.query(
    // insert user into group
    "INSERT INTO `GroupUser` (`CourseName`,`Semester`,`GroupName`,`Login`) VALUES(?,?,?,?)",
    [
      req.query.CourseName,
      req.query.Semester,
      req.query.GroupName,
      req.session.username
    ],
    function(error, results, fields) {
      // error handling for insert errors
      if (error) return next(errorTranslation.joinGroup(error));

      // respond with successfull insert
      res.status(200).send("successfull");
    }
  );
});

/**
 * function for leaving a group in a group assignment
 */
router.post("/leavegroup", function(req, res, next) {
  sql.query(
    // delete user from group
    "DELETE FROM `GroupUser` WHERE `CourseName` = ? AND `Semester` = ? AND `GroupName` = ? AND `Login` = ?;",
    [
      req.query.CourseName,
      req.query.Semester,
      req.query.GroupName,
      req.session.username
    ],
    function(error, results, fields) {
      // error handling for group leaving
      if (error) return next(errorTranslation.leaveGroup(error));
      // check if a row was deleted
      if (results.affectedRows === 0) {
        // respond with no user in group
        return next(
          new Error("User not in group or group not found or not logged in")
        );
      }
      // respond with successfull deletion
      res.status(200).send("successfull");
    }
  );
});

/**
 * function for inserting or updating a group
 */
router.post("/insertorupdategroup", function(req, res, next) {
  // check for user permissions in course
  permission(
    req.query.Semester,
    req.query.CourseName,
    req.session.username,
    function(perm) {
      // check user permission
      if (perm === "admin") {
        sql.query(
          // insert or update group
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
            // error handling for insert/update
            if (error) return next(errorTranslation.insertOrUpdateGroup(error));
            // respond with succsessfull login
            res.status(200).send("successfull");
          }
        );
      } else {
        // respond, that the user has the wrong permissions
        next(new Error("wrong permissions or course not found"));
      }
    }
  );
});

/**
 * function to toggle the group visibility of the group assignment
 */
router.post("/togglegroupvisibility", function(req, res, next) {
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    if (perm === "admin") {
      sql.query(
        // toggle the group visibility on th course
        "UPDATE `Course` SET `GroupVisible` = !`GroupVisible` WHERE `Name` = ? AND `Semester` = ?",
        [req.query.Name, req.query.Semester],
        function(error, results, fields) {
          // error handling
          if (error) return next(errorTranslation.toggleGroupVisibility(error));
          // successfull change
          res.status(200).send("successfull");
        }
      );
    } else {
      // respond, that the user has the wrong permissions
      next(new Error("wrong permissions or course not found"));
    }
  });
});

/**
 * function to toggle the group timer active of the group assignment
 */
router.post("/togglegrouptimeractive", function(req, res, next) {
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    if (perm === "admin") {
      sql.query(
        // toggle the group visibility on th course
        "UPDATE `Course` SET `GroupTimerActive` = !`GroupTimerActive` WHERE `Name` = ? AND `Semester` = ?",
        [req.query.Name, req.query.Semester],
        function(error, results, fields) {
          // error handling
          if (error)
            return next(errorTranslation.toggleGroupTimerActive(error));
          // successfull change
          res.status(200).send("successfull");
        }
      );
    } else {
      // respond, that the user has the wrong permissions
      next(new Error("wrong permissions or course not found"));
    }
  });
});

router.post("/grouptimer", function(req, res, next) {
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    if (perm === "admin") {
      sql.query(
        /* Insert the new course time into the database */
        "UPDATE `Course` SET `GroupTimer` = ? WHERE `Name` = ? AND `Semester` = ?",
        [req.query.Time, req.query.Name, req.query.Semester],
        function(error, results, fields) {
          // error handling
          if (error) return next(errorTranslation.groupTimer(error));
          /* respond that the groupVisibility got toggled if GroupTimerActive 
          was 0 */
          res.status(200).send("successfull");
        }
      );
    } else {
      // respond, that the user has the wrong permissions
      next(new Error("wrong permissions or course not found"));
    }
  });
});

router.get("/groupcontent", function(req, res, next) {
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    if (perm === "admin" || perm === "tutor" || perm === "user") {
      sql.query(
        /* Select groups from database */
        "SELECT `GroupName`, `Tutor`, `Ordering`,`Starttime`, `Endtime`, `Weekday`, `Maxuser`, `Room` FROM `Groups` WHERE `CourseName` = ? AND `Semester` = ?",
        [req.query.Name, req.query.Semester],
        function(error, results, fields) {
          // error handling
          if (error) next(error);
          // send the groups to the clouennt
          res.status(200).send(results);
        }
      );
    } else {
      // respond, that the user has the wrong permissions
      next(new Error("wrong permissions or course not found"));
    }
  });
});

module.exports = router;

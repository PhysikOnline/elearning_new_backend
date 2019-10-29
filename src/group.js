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
            if (error) return next(errorTranslation.insertOrUpdateGroup(error));
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
          // sucsessfull change
          res.status(200).send("sucsessfull");
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
          // sucsessfull change
          res.status(200).send("sucsessfull");
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
          res.status(200).send("sucsessfull");
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

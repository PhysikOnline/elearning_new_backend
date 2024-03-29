var express = require("express");
var router = express.Router();
var sql = require("../db/db");
var permission = require("./courseFunctions");
var errorTranslation = require("../apiFunctions/errorTranslation");
var { parse } = require("json2csv");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

/**
 * function for getting a group user csv
 */
router.get("/groupcsv", function(req, res, next) {
  // check for user permissions in course
  permission(
    req.query.Semester,
    req.query.CourseName,
    req.session.username,
    function(perm) {
      if (perm === "admin" || perm == "tutor") {
        sql.query(
          // delete group
          "SELECT U.`firstname`, U.`lastname`, U.`Login`, U.`email` FROM `GroupUser` as G, `User` as U WHERE G.`CourseName`=? AND G.`Semester`=? AND G.`GroupName`=? AND U.`Login`=G.`Login`",
          [req.query.CourseName, req.query.Semester, req.query.GroupName],
          function(error, results, fields) {
            // error handling for deletion errors
            if (error) return next(errorTranslation.joinGroup(error));
            // respond with successfull delete
            try {
              const csv = parse(results, [
                "firstname",
                "lastname",
                "Login",
                "email"
              ]);
              res.attachment(req.query.GroupName + ".csv");
              res.status(200).send(csv);
            } catch (err) {
              next(err);
            }
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
 * function for deleting a group in a group assignment
 */
router.get("/assignedgroup", function(req, res, next) {
  // check for user permissions in course
  sql.query(
    // insert user into group
    "SELECT GroupName FROM (SELECT `GroupName`, `Tutor` AS Login FROM `Groups` \
    WHERE `CourseName` = ? AND `Semester` = ? \
    UNION ALL SELECT `GroupName`, `Login` FROM `GroupUser` WHERE \
    `CourseName` = ? AND `Semester` = ?) a \
    WHERE `Login` = ?",
    [
      req.query.CourseName,
      req.query.Semester,
      req.query.CourseName,
      req.query.Semester,
      req.session.username
    ],
    function(error, results, fields) {
      // error handling for select errors
      if (error) return next(errorTranslation.assignedGroups(error));
      // respond with assigned groups
      res.status(200).send(results.map(x => x.GroupName));
    }
  );
});

/**
 * function for deleting a group in a group assignment
 */
router.post("/deletegroup", function(req, res, next) {
  // check for user permissions in course
  permission(
    req.query.Semester,
    req.query.CourseName,
    req.session.username,
    function(perm) {
      if (perm === "admin") {
        sql.query(
          // delete group
          "DELETE FROM `Groups` WHERE `CourseName` = ? AND `Semester` = ? AND `GroupName` = ?",
          [req.query.CourseName, req.query.Semester, req.query.GroupName],
          function(error, results, fields) {
            // error handling for deletion errors
            if (error) return next(errorTranslation.joinGroup(error));
            // check if a row was deleted
            if (results.affectedRows === 0) {
              // respond with no user in group
              return next(new Error("Group not found"));
            }
            // respond with successfull delete
            res.status(200).send({ succsessfull: true });
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
 * function for joining a group in a group assignment
 */
router.post("/joingroup", function(req, res, next) {
  sql.query(
    // insert user into group
    "INSERT INTO `GroupUser` (`CourseName`,`Semester`,`GroupName`,`Login`) \
    SELECT ?,?,?,? FROM `Course` WHERE \
    (`GroupTimer` < CURRENT_TIMESTAMP AND `GroupTimerActive` OR `GroupVisible`) \
    AND `Name` = ? AND `Semester` = ?",
    [
      req.query.CourseName,
      req.query.Semester,
      req.query.GroupName,
      req.session.username,
      req.query.CourseName,
      req.query.Semester
    ],
    function(error, results, fields) {
      // error handling for insert errors
      if (error) return next(errorTranslation.joinGroup(error));
      if (results.affectedRows === 0) {
        // respond with no user in group
        return next(new Error("did not joined group"));
      }
      // respond with successfull insert
      res.status(200).send({ succsessfull: true });
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
      res.status(200).send({ succsessfull: true });
    }
  );
});

/**
 * function for inserting or updating a group
 */
router.post("/insertorupdategroup", function(req, res, next) {
  let tutor =
    req.query.Tutor === null ||
    req.query.Tutor === "" ||
    req.query.Tutor === "null" ||
    req.query.Tutor === "undefined" ||
    !req.query.Tutor
      ? "NULL"
      : sql.escape(req.query.Tutor);
  let OldGroupName =
    req.query.OldGroupName === null ||
    req.query.OldGroupName === "" ||
    req.query.OldGroupName === "null" ||
    req.query.OldGroupName === "undefined" ||
    !req.query.OldGroupName
      ? sql.escape(req.query.GroupName)
      : sql.escape(req.query.OldGroupName);
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
          "INSERT INTO `Groups` (`CourseName`, `Semester`, `GroupName`, `Tutor`, `Starttime`, `Weekday`, `Endtime`, `Maxuser`, `Room`) VALUES (?, ?, " +
            OldGroupName +
            ", " +
            tutor +
            ", ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `GroupName` = ?, `Tutor` = VALUES(`Tutor`), `Starttime` = VALUES(`Starttime`), `Weekday` = VALUES(`Weekday`), `Endtime` = VALUES(`Endtime`), `Maxuser` = VALUES(`Maxuser`), `Room` = VALUES(`Room`)",
          [
            req.query.CourseName,
            req.query.Semester,
            // req.query.OldGroupName === "undefined"
            //   ? req.query.OldGroupName
            //   : req.query.GroupName,
            // req.query.Tutor,
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
            res.status(200).send({ succsessfull: true });
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
          res.status(200).send("succsessfull");
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
        "SELECT G.`GroupName`, G.`Tutor`, G.`Ordering`,G.`Starttime`, G.`Endtime`, \
        G.`Weekday`, G.`Maxuser`, G.`Room`, (SELECT Count(*) FROM GroupUser AS U \
        WHERE U.`CourseName` = ? AND U.`Semester` = ? AND U.`GroupName` = G.`GroupName`) \
        AS AssignedUser FROM `Groups` AS G WHERE G.`CourseName` = ? AND G.`Semester` = ?",
        [
          req.query.Name,
          req.query.Semester,
          req.query.Name,
          req.query.Semester
        ],
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

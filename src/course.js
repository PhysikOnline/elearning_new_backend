var express = require("express");
var router = express.Router();
var sql = require("../db/db");
var fs = require("fs");
var pdf = require("pdf-parse");

var permission = require("./courseFunctions");
var errorTranslation = require("../apiFunctions/errorTranslation");

var group = require("./group");

// import multer for file parsing
var multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).single("file");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

/**
 * get all file names for the course
 */
router.get("/filenames", function(req, res, next) {
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    if (perm === "admin" || perm === "user" || perm === "tutor") {
      fs.readdir(
        "data/" +
          req.query.Semester.replace("/", " ") +
          "/" +
          req.query.Name +
          "/exercise/",
        (err, exercise) => {
          fs.readdir(
            "data/" +
              req.query.Semester.replace("/", " ") +
              "/" +
              req.query.Name +
              "/script/",
            (err, script) => {
              res.status(200).send({ script: script, exercise: exercise });
            }
          );
        }
      );
    } else {
      next(new Error("wrong permissions or course not found"));
    }
  });
});

/**
 * add pdf test
 */
router.post("/pdf", function(req, res, next) {
  // user authentication
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    // allow user, admin and tutor access to pdf's
    if (perm === "admin") {
      // ensure that just the exercise and script folder can be accessed
      if (
        req.query.subfolder !== "exercise" &&
        req.query.subfolder !== "script"
      ) {
        // respond that this subfolder is not alloesd
        return next(new Error("this subfolder is not allowed"));
      }
      // read all files in subdir for existance checking
      fs.readdir(
        "data/" +
          req.query.Semester.replace("/", " ") +
          "/" +
          req.query.Name +
          "/" +
          req.query.subfolder +
          "/",
        (err, script) => {
          // parsing file in request
          upload(req, res, function(error) {
            if (error) throw error;
            // check that file exists
            if (!script.includes(req.file.originalname)) {
              // chek, if file in buffer is pdf
              pdf(req.file.buffer).then(
                // file is pdf
                function(data) {
                  fs.writeFile(
                    "data/" +
                      req.query.Semester.replace("/", " ") +
                      "/" +
                      req.query.Name +
                      "/" +
                      req.query.subfolder +
                      "/" +
                      req.file.originalname,
                    req.file.buffer,
                    function(err) {
                      if (err) throw err;
                      res.status(200).send({ succsessfull: true });
                    }
                  );
                },
                // file is not pdf
                function(err) {
                  return next(new Error("file is not a pdf"));
                }
              );
              // delete file
            } else {
              // throw error, that file does not exists
              next(new Error("file already exists"));
            }
          });
        }
      );
    } else {
      // throw permissions or course does not exist error
      next(new Error("wrong permissions or course not found"));
    }
  });
});

/**
 * delete pdf test
 */
router.delete("/pdf", function(req, res, next) {
  // user authentication
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    // allow user, admin and tutor access to pdf's
    if (perm === "admin") {
      // ensure that just the exercise and script folder can be accessed
      if (
        req.query.subfolder !== "exercise" &&
        req.query.subfolder !== "script"
      ) {
        // respond that this subfolder is not alloesd
        return next(new Error("this subfolder is not allowed"));
      }
      // read all files in subdir for existance checking
      fs.readdir(
        "data/" +
          req.query.Semester.replace("/", " ") +
          "/" +
          req.query.Name +
          "/" +
          req.query.subfolder +
          "/",
        (err, script) => {
          // check that file exists
          if (script.includes(req.query.file)) {
            // delete file
            fs.unlink(
              "data/" +
                req.query.Semester.replace("/", " ") +
                "/" +
                req.query.Name +
                "/" +
                req.query.subfolder +
                "/" +
                req.query.file,
              function(error) {
                // error handling
                if (error) return next(error);
                // respond with sucsessfull deletion
                res.status(200).send({ succsessfull: true });
              }
            );
          } else {
            // throw error, that file does not exists
            next(new Error("file does not exist"));
          }
        }
      );
    } else {
      // throw permissions or course does not exist error
      next(new Error("wrong permissions or course not found"));
    }
  });
});

/**
 * download pdf test
 */
router.get("/pdf", function(req, res, next) {
  // user authentication
  permission(req.query.Semester, req.query.Name, req.session.username, function(
    perm
  ) {
    // allow user, admin and tutor access to pdf's
    if (perm === "user" || perm === "admin" || perm === "tutor") {
      // ensure that just the exercise and script folder can be accessed
      if (
        req.query.subfolder !== "exercise" &&
        req.query.subfolder !== "script"
      ) {
        // respond that this subfolder is not alloesd
        return next(new Error("this subfolder is not allowed"));
      }
      // read all files in subdir for existance checking
      fs.readdir(
        "data/" +
          req.query.Semester.replace("/", " ") +
          "/" +
          req.query.Name +
          "/" +
          req.query.subfolder +
          "/",
        (err, script) => {
          // check that file exists
          if (script.includes(req.query.file)) {
            // create file stream
            var file = fs.createReadStream(
              "data/" +
                req.query.Semester.replace("/", " ") +
                "/" +
                req.query.Name +
                "/" +
                req.query.subfolder +
                "/" +
                req.query.file
            );
            // error heandling for create read stream
            file.on("error", function(error) {
              return next(errorTranslation.pdf(error));
            });
            // send stream to res
            file.pipe(res);
          } else {
            // throw error, that file does not exists
            next(new Error("file does not exist"));
          }
        }
      );
    } else {
      // throw permissions or course does not exist error
      next(new Error("wrong permissions or course not found"));
    }
  });
});

/**
 * function to join a course
 */
router.post("/joincourse", function(req, res, next) {
  sql.query(
    "INSERT INTO `CoursePermissions` (`Name`, `Semester`, `Login`, `Permissions`) VALUES (?, ?, ?, 'user')",
    [req.query.CourseName, req.query.Semester, req.session.username],
    function(error, results, fields) {
      // error handling
      if (error) return next(errorTranslation.joinCourse(error));
      // respond with succsessfull
      res.status(200).send({ succsessfull: true });
    }
  );
});

/**
 * function to leave a course
 */
router.post("/leavecourse", function(req, res, next) {
  sql.query(
    "DELETE FROM `CoursePermissions` WHERE `Name` = ? AND `Semester` = ? AND `Login` = ? AND `Permissions` = 'user'",
    [req.query.CourseName, req.query.Semester, req.session.username],
    function(error, results, fields) {
      // error handling
      if (error) throw next(errorTranslation.leaveCourse(error));
      // check if a row was deleted
      if (results.affectedRows === 0) {
        // respond with no course or user found
        return next(new Error("user or course not found"));
      }
      // respond with succsessfull
      res.status(200).send({ succsessfull: true });
    }
  );
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
            res.status(200).send("successfull");
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
        // initialize with no permissions
        course.auth = [];
        /* fetch the user permissions, this is to handle the content in the 
        frontend */
        permission(
          req.query.Semester,
          req.query.Name,
          req.session.username,
          function(perm) {
            switch (perm) {
              case "admin":
                // add user permissions to the admin
                course.auth = ["user", "tutor", "admin"];
                break;
              case "tutor":
                // add user permissions to the tutor
                course.auth = ["user", "tutor"];
                break;
              case "user":
                // keep user permissions
                course.auth = ["user"];
                break;
              default:
                break;
            }
            res.status(200).send(course);
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

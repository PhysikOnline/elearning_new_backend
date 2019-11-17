var express = require("express");
var router = express.Router();
// import database
var sql = require("../db/db");
var errorTranslation = require("../apiFunctions/errorTranslation");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

/**
 * function which checks the login and stores the username into the session
 */
router.post("/login", function(req, res) {
  // check, if a user is already logged in
  if (req.session.username) {
    // respond that a user is already logged in
    res.status(200).send("ERROR: User already logged in");
  } else {
    sql.query(
      /* select user from the database with the matching password, 
      which is stored in the databse with a hash. */
      "SELECT * FROM `User` WHERE `Login` = ? AND password = PASSWORD(?)",
      [req.query.username, req.query.password],
      function(error, results, fields) {
        // error handling
        if (error) throw error;
        /* if the lenght of the response is 1, the username and password are 
        correct. Keep in mind, because of (Login, pasword) beeing primary keys
        in the databse, the lenght can just be 0 or 1 */
        if (results.length === 1) {
          // assign username to session
          req.session.username = req.query.username;
          // respond with a successfull login
          res.status(200).send("Login successfull");
        } else {
          // if the result.lenght is not 1, then the credentials are fals.
          res.status(200).send("ERROR: Incorrect credentials");
        }
      }
    );
  }
});

/**
 * function to handle the logout of a user
 */
router.post("/logout", function(req, res) {
  // checks if a user is logged in
  if (!req.session.username) {
    // respond with no user beeing logged in
    res.status(200).send("ERROR: No User logged in");
  } else {
    // delete the session from the store
    req.session.destroy(function(error) {
      // error handling
      if (error) throw error;
      // respond with a secsessfull logout
      res.status(200).send("successfully logged out");
    });
  }
});

router.get("/currentcourses", function(req, res, next) {
  sql.query(
    // get current courses of user
    "select distinct CourseName from Groups where Tutor= ? IN (select Name from CoursePermissions where Login= ?)",
    [req.session.username, req.session.username],
    function(error, results, fields) {
      if (error) {
        return next(errorTranslation.currentCourses(error));
      }
      res.status(200).send(results);
    }
  );
});

/**
 * function for checking the current sesseion status
 */
router.get("/checklogin", function(req, res) {
  // check if a user is logged in
  if (!req.session.username) {
    // respond that no user is logged in
    res.status(200).send("false");
  } else {
    // respond that a user i logged in
    res.status(200).send("true");
  }
});

module.exports = router;

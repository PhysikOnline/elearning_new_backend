var express = require("express");
var router = express.Router();
var sql = require("../db/db");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
});

router.post("/login", function(req, res) {
  if (req.session.username) {
    res.status(200).send("ERROR: User already logged in");
  } else {
    sql.query(
      "SELECT * FROM `User` WHERE `s-Nummer` = ? AND password = PASSWORD(?)",
      [req.query.username, req.query.password],
      function(error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {
          req.session.username = req.query.username;
          res.status(200).send("Login sucsessfull");
        } else {
          res.status(200).send("ERROR: Incorrect credentials");
        }
      }
    );
  }
});

router.post("/logout", function(req, res) {
  if (!req.session.username) {
    res.status(200).send("ERROR: No User logged in");
  } else {
    req.session.destroy(function(error) {
      if (error) throw error;
      res.status(200).send("Sucsessfully logged out");
    });
  }
});

module.exports = router;

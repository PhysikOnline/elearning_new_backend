var express = require("express");
var router = express.Router();
var sql = require("../db/db");

// middleware that is specific to this router
router.use(function(req, res, next) {
  next();
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

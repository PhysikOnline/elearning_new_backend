"user strict";

var mysql = require("mysql");
var fs = require("fs");
const credentials = require("./credentials");

var pool = mysql.createPool({
  host: credentials.host,
  user: credentials.user,
  port: credentials.port,
  password: credentials.password,
  database: credentials.database,
  multipleStatements: true
});

// connection.connect(function(error) {
//   if (error) {
//     throw error;
//   }
// });

pool.getConnection(function(err, connection) {
  if (err) throw err; // not connected!

  // Execute the database initialisation
  connection.query(fs.readFileSync("db/init.sql").toString(), function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
  });

  connection.query(fs.readFileSync("db/testdata.sql").toString(), function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
  });
  connection.release();
});

module.exports = pool;

"user strict";

var mysql = require("mysql");
// import fs for reading in the database initialisation
var fs = require("fs");
var update = require("./update");

// create a connection pool, to handle multiple connections to the databse
var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  multipleStatements: true
});

/* .getConnection reserves the connection for the followed executeion it has to
be released with .release */
pool.getConnection(function(err, connection) {
  // error handling
  if (err) throw err;

  if (process.env.NODE_ENV === "development") {
    console.log("App is Starting in development");
  // Execute the database initialisation
    process.stdout.write("Initializing database");
  connection.query(fs.readFileSync("db/init.sql").toString(), function(
    error,
    results,
    fields
  ) {
    // error hanling
    if (error) throw error;
      process.stdout.write(" - done\n");
      process.stdout.write("Filling database with testdata");
  });

  // fill the databse with test data
  connection.query(fs.readFileSync("db/testdata.sql").toString(), function(
    error,
    results,
    fields
  ) {
    // error handling
    if (error) throw error;
      process.stdout.write(" - done\n");
  });
  }
  // release the connection back to the pool so other functions can use it again
  connection.release();
});

module.exports = pool;

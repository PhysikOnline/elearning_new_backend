"user strict";

var mysql = require("mysql");
// import fs for reading in the database initialisation
var fs = require("fs");
//; import credentials for the database connection
const credentials = require("./credentials");

// create a connection pool, to handle multiple connections to the databse
var pool = mysql.createPool({
  host: credentials.host,
  user: credentials.user,
  port: credentials.port,
  password: credentials.password,
  database: credentials.database,
  multipleStatements: true
});

/* .getConnection reserves the connection for the followed executeion it has to
be released with .release */
pool.getConnection(function(err, connection) {
  // error handling
  if (err) throw err;

  // Execute the database initialisation
  connection.query(fs.readFileSync("db/init.sql").toString(), function(
    error,
    results,
    fields
  ) {
    // error hanling
    if (error) throw error;
  });

  // fill the databse with test data
  connection.query(fs.readFileSync("db/testdata.sql").toString(), function(
    error,
    results,
    fields
  ) {
    // error handling
    if (error) throw error;
  });
  // release the connection back to the pool so other functions can use it again
  connection.release();
});

module.exports = pool;

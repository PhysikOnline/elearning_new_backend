"user strict";

var mysql = require("mysql");
var fs = require("fs");
const credentials = require("./credentials");

var connection = mysql.createConnection({
  host: credentials.host,
  user: credentials.user,
  port: credentials.port,
  password: credentials.password,
  database: credentials.database,
  multipleStatements: true
});

connection.connect();

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

module.exports = connection;

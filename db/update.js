("user strict");

var mysql = require("mysql");
// import fs for reading in the database initialisation
var fs = require("fs");
// import credentials for the database connection
require("dotenv").config();

// create a connection pool, to handle multiple connections to the databse
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  multipleStatements: true
});

function updateDatabase(con, runByModule = true) {
  // updating database
  con.query("SELECT value FROM Settings WHERE `key`='version'", function(
    error,
    results,
    fields
  ) {
    let version = Number(results[0].value);
    // error hanling
    if (error) throw error;
    fs.readdir("db/updates/", (err, allUpdates) => {
      if (err) throw err;
      let updates = allUpdates
        .map(x => x.replace(".sql", ""))
        .map(x => Number(x))
        .filter(x => x > version)
        .sort((a, b) => a - b);
      console.log("Updates to apply:", updates);
      let firstUpdate = updates[0];
      let lastUpdate = updates[updates.length - 1];
      if (updates.length !== 0) {
        process.stdout.write("Applying update " + firstUpdate);
      } else {
        if (!runByModule) {
          console.log("Database is up to date");
          process.exit();
        }
      }
      updates.forEach(x => {
        con.query(
          fs.readFileSync("db/updates/" + x + ".sql").toString(),
          function(error, results, fields) {
            // error handling
            if (error) throw error;
            con.query(
              "UPDATE `Settings` SET `value` = " +
                String(x) +
                " WHERE `key` = 'version'",
              function(errors, resultss, fieldss) {
                // error handling
                if (errors) throw errors;
                // console.log("finished filling database");
                process.stdout.write(" - done\n");
                if (x === lastUpdate) {
                  if (!runByModule) {
                    console.log("Database is up to date");
                    process.exit();
                  }
                } else {
                  process.stdout.write("Applying update " + String(x + 1));
                }
              }
            );
          }
        );
      });
    });
  });
}

if (require.main === module) {
  updateDatabase(connection, false);
}

module.exports = updateDatabase;

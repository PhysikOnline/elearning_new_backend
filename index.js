// import express
const express = require("express");
const app = express();
const port = 3001;
// import session management
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
// import routing
var user = require("./src/user");
var course = require("./src/course");
// import mysql credentials
const credentials = require("./db/credentials");

// setup session management
var sessionStore = new MySQLStore({
  host: credentials.host,
  user: credentials.user,
  port: credentials.port,
  password: credentials.password,
  database: credentials.database
});

app.use(
  session({
    secret: "keyboard cat",
    store: sessionStore,
    unset: "destroy",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10800000 /*3 hours*/, sameSite: "lax" }
  })
);

// setup router
app.use("/user", user);

app.use("/course", course);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

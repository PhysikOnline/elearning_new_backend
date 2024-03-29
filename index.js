require("dotenv").config();
// import express
const express = require("express");
const app = express();
const port = 3001;
// import error handling middleware
const errorHandling = require("./apiFunctions/errorHandling");
// import session management
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
// import routing
var user = require("./src/user");
var course = require("./src/course");
// import mysql credentials
// for compremizing the web request
var compression = require("compression");
app.use(compression());
// security package
var helmet = require("helmet");
app.use(helmet());

// define the store of our sessions (it is our database)
var sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA
});

// make the app use the session management
app.use(
  session({
    // sessionID secret, will be changes in production
    secret: "keyboard cat",
    /* set the store as our previously defined databse store, otherwise the session
     will be stored in the process */
    store: sessionStore,
    /* this defines th result of unsetting req.session, 
    'destroy' will delete the session */
    unset: "destroy",
    // this disables the save to the store if nothing changed to the session
    resave: false,
    // this will not save unchanged sessions, it releases some database storage
    saveUninitialized: false,
    cookie: {
      // define, when the coockie expires
      maxAge: 10800000 /*3 hours*/,
      // lax enables the coockie everywhere on our site(correct me if I'm wrong)
      sameSite: "lax"
    }
  })
);

// setup router
app.use("/api/user", user);
app.use("/api/course", course);

// errorHandling Middleware
app.use(errorHandling);

// start the app
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

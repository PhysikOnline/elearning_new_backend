# Requirements

- npm
- node
- nodemon (sudo npm install -g nodemon)
- [frontend](https://github.com/PhysikOnline/elearning_new_frontend)

# Recommendet Requirements

- vscode (Extensions: Prettier)
- MySQL Workbench
- Postman

# Before you start

Make shure, that you inserted your firstname in "database" under `./backend/sql/credentials.js`. So when you firstname is Albert, it should look like this:

````js
const options = {
    host: '141.2.246.162',
    user: 'elearning',
    port: '3306',
    password: 'elearningpw',
    database: 'albert',
};

# Database Tutorial

The connetion of the database is specified inside `/db/db.js`. The database initialisation script is located inside `/db/init.sql`. To use the Database in you .js files, you simplly do:

```js
var sql = require("./db/db.js");
````

queries can the be executed with:

```js
sql.query("you querry", function(error, results, fields) {
  if (error) throw error;
});
```

Documentation for MariaDB(SQL) and the MySQL Connector can be found here:

- https://mariadb.com/kb/en/library/documentation/
- https://github.com/mysqljs/mysql

# Start the Project

Before starting the project, you need to install all needed packages:

```
npm install
```

After a sucsessfull install (Some package installs result in some warnings, but these can be connected, that you are not using a Mac) do:

```
npm run start
```

# Session Tutorial

We use express-session (https://www.npmjs.com/package/express-session) to create an manage sessions. The client gets a `sessionID`. With that `sessionID` can be data associated (i.e. username) wich would normally be stored in the local storage of our server. I say normally, because we use the mysql extension of express-session (https://www.npmjs.com/package/express-mysql-session) wich allows us to store the data in our database, that enables us to use multiple servers for load balancing and persist sessions after server restarts. The session data (here username) can be accessed with:

```
req.session.username
```

I would recommend to read the documentation of express-session.

# API Documentation:

## /user

### POST /user/login

| Attribute | Type   | Required | Describtion                           |
| --------- | ------ | -------- | ------------------------------------- |
| username  | string | yes      | Username you want to log in with      |
| password  | string | yes      | Password assiciated with the Username |

| Response                      | Describtion                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| ERROR: User already logged in | there is a user already logged in please log out before, or delete the session coockie              |
| ERROR: Incorrect credentials  | the username or the passowrd provided, do not match the username or password stored in the database |
| Login sucsessfull             | sucsesfully logged in, the username will be assiciated with the current session cockie              |

### POST /user/logout

| Attribute | Type | Required | Describtion |
| --------- | ---- | -------- | ----------- |
| -         | -    | -        | -           |

| Response                 | Describtion                          |
| ------------------------ | ------------------------------------ |
| Sucsessfully logged out  | the session was sucsessfully removed |
| ERROR: No User logged in | user not logged in, please log in    |

### GET /user/checklogin

| Attribute | Type | Required | Describtion |
| --------- | ---- | -------- | ----------- |
| -         | -    | -        | -           |

| Response | Describtion                                     |
| -------- | ----------------------------------------------- |
| true     | the session is assiciated with a logged in user |
| false    | there is no user belonging to this session      |

### GET /course/getallcourses

| Attribute | Type | Required | Describtion |
| --------- | ---- | -------- | ----------- |
| -         | -    | -        | -           |

Response:  
Getting an array of objects which are sorted by semester. The objects include names of courses for each semester.

#### Example

```JSON
[
    {
        "Semester": "WiSe 19/20",
        "Name": [
            "Gewaltsamer Überfall für Fortgeschrittene",
            "Grundlagen in Mobbing 2",
            "Opferdarstellung 2"
        ]
    },
    {
        "Semester": "SoSe 19",
        "Name": [
            "Grundlagen in Mobbing 1",
            "Opferdarstellung 1",
            "Psychologie der erfolgreichen Erpressung 1"
        ]
    }
]
```

# Todo

- Figure out how to do a proper "close connection"
- Find out, why there are SQL disconnecs after a few minutes

```

```

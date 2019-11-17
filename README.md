# Requirements

- npm
- node
- nodemon (sudo npm install -g nodemon)
- [frontend](https://github.com/PhysikOnline/elearning_new_frontend)

# Recommendet Requirements

- vscode (Extensions: Prettier)
- MySQL Workbench
- Postman

# Packages we use

- express-mysql-session
- express-session
- json2csv
- multer
- mysql
- pdf-parse
- compression
- helmet
- dotenv

# Before you start

Make shure, that you created a `.env` file in your root directory, with the content:

```
# define development enviroment
NODE_ENV=development

# database connection
DB_HOST=141.2.246.162
DB_USER=elearning
DB_PORT=3306
DB_PASS=elearningpw
DB_DATA=elearning
```

if the database is realy busy, you can change the database name to your firstname.

Please **do not commit the `.env` file**. With this method, I want to prevent, that we are starting the development server on the live system, because this will remove all the data in the databse.

# Database Tutorial

The connetion of the database is specified inside `/db/db.js`. The database initialisation script is located inside `/db/init.sql`. To use the Database in you .js files, you simplly do:

```js
var sql = require("./db/db.js");
```

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

After a successfull install (Some package installs result in some warnings, but these can be connected, that you are not using a Mac) do:

```
npm run start
```

# Session Tutorial

We use express-session (https://www.npmjs.com/package/express-session) to create an manage sessions. The client gets a `sessionID`. With that `sessionID` can be data associated (i.e. username) wich would normally be stored in the local storage of our server. I say normally, because we use the mysql extension of express-session (https://www.npmjs.com/package/express-mysql-session) wich allows us to store the data in our database, that enables us to use multiple servers for load balancing and persist sessions after server restarts. The session data (here username) can be accessed with:

```
req.session.username
```

I would recommend to read the documentation of express-session.

# Error handling and validation

## Validation

There is a Function to get the permissions of a user in a course. It is defined in `./src/courseFunctions.js`. Basic usage is:

```js
var permission = require("./courseFunctions");
permission(
  req.query.Semester,
  req.query.CourseName,
  req.session.username,
  function(perm) {
    if (perm === "admin") {
      /* have fun */
    } else {
      // respond, that the user has the wrong permissions
      next(new Error("wrong permissions or course not found"));
    }
  }
);
```

BUT THERE IS MORE!!!

Varriable validation is done by the database, which should return an error (can be mor or less easy to handle). For each api function, you **PLEASE** create a error handling script in `./apiFunctions/errorTranslation/`, there are already more than enough examples. Then you insert your error translation into `./apiFunctions/errorTranslation.js`. To use your error translation in your code, you can do:

```js
var errorTranslation = require("../apiFunctions/errorTranslation");

// some code
sql.query("blablabla", [bla, blub, quark], function(error, results, fields) {
  if (error)
    return next(
      errorTranslation.theErrorFunctionThatYouWroteOutOfFreeWill(error)
    );
});
// other code
```

## Error Handling

If you want to throw an error in your function to notify the api user, you can to

```js
router.whatever("/pathsAreForNoobs", function(req, res, next) {
  return next(new Error("Your error!"));
});
```

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
| Login successfull             | sucsesfully logged in, the username will be assiciated with the current session cockie              |

### POST /user/logout

| Attribute | Type | Required | Describtion |
| --------- | ---- | -------- | ----------- |
| -         | -    | -        | -           |

| Response                 | Describtion                          |
| ------------------------ | ------------------------------------ |
| successfully logged out  | the session was successfully removed |
| ERROR: No User logged in | user not logged in, please log in    |

### GET /user/checklogin

| Attribute | Type | Required | Describtion |
| --------- | ---- | -------- | ----------- |
| -         | -    | -        | -           |

| Response | Describtion                                     |
| -------- | ----------------------------------------------- |
| true     | the session is assiciated with a logged in user |
| false    | there is no user belonging to this session      |

### GET /course/allcourses

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

### GET /course/coursecontent

| Attribute | Type   | Required | Describtion               |
| --------- | ------ | -------- | ------------------------- |
| Semester  | string | yes      | Semester of the course    |
| Name      | string | yes      | Module name of the course |

| Response                      | Describtion                            |
| ----------------------------- | -------------------------------------- |
| `{ error: "No course found"}` | There is no with that Semester an Name |

There is just one error response. An example response could be:

```JSON
{
    "Semester": "WiSe 19/20",
    "Name": "Grundlagen in Mobbing 2",
    "auth": [
        "user",
        "admin"
    ]
}
```

For the authentication in the course we send an array of permissions. To verify it in the frontend you can do:

```js
courseVarriable.auth.inculudes("admin");
```

### POST /course/insertdescription

| Attribute   | Type                         | Required | Describtion               |
| ----------- | ---------------------------- | -------- | ------------------------- |
| Semester    | String                       | yes      | Semester of the course    |
| Name        | string                       | yes      | Module name of the course |
| Description | html(but it is not verified) | yes      | The Description in HTML   |

| Response                                  | Describtion                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| ERROR: No Course with Assigned User found | The user has no permissions on the used course (not even the "user" permission) |
| Wrong permissions                         | The user has not the "admin" permission                                         |
| successfull                               | The description was successfully changed                                        |

### POST /course/group/joingroup

| Attribute  | Type   | Required | Describtion               |
| ---------- | ------ | -------- | ------------------------- |
| Semester   | String | yes      | Semester of the course    |
| CourseName | string | yes      | Module name of the course |
| GroupName  | String | yes      | Group Name of the Course  |

| Response                                                   | Describtion                                    |
| ---------------------------------------------------------- | ---------------------------------------------- |
| `{error: { User: "already in Group" }}`                    | User is already in a group                     |
| `{error: { Group: "is Full" }}`                            | The group you want to join is full             |
| `{error: { Group: "can just be joined by course users" }}` | The logged in user is not a user of the course |
| `{error: { Group: "not found" }}`                          | No group was found in the course               |
| `{error: { CourseName: "is too long" }}`                   | The CourseName is too Long                     |
| `{error: { CourseName: "cannot be null" }}`                | The CourseName cannot be null                  |
| `{error: { Semester: "is too long" }}`                     | The Semester is too Long                       |
| `{error: { Semester: "cannot be null" }}`                  | The Semester cannot be null                    |
| `{error: { GroupName: "is too long" }}`                    | The GroupName is too Long                      |
| `{error: { GroupName: "cannot be null" }}`                 | The GroupName cannot be null                   |
| `{error: { User: "not logged in" }}`                       | There is no user logged in                     |
| successfull                                                | succsessfully joined the group                 |

### POST /course/group/leavegroup

| Attribute  | Type   | Required | Describtion               |
| ---------- | ------ | -------- | ------------------------- |
| Semester   | String | no       | Semester of the course    |
| CourseName | string | no       | Module name of the course |
| GroupName  | String | no       | Group Name of the Course  |

| Response                                                           | Describtion                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `{error: "User not in group or group not found or not logged in"}` | There is no User within such a Group or no user is logged in |
| successfull                                                        | succsessfully left the group                                 |

### POST /course/group/insertorupdategroup

            req.query.Room

| Attribute    | Type                                                         | Required                           | Describtion                                                                            |
| ------------ | ------------------------------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------- |
| Semester     | String                                                       | yes                                | Semester of the course                                                                 |
| CourseName   | string                                                       | yes                                | Module name of the course                                                              |
| GroupName    | String                                                       | yes                                | new Group Name of the Course (make it the same as OldGroupName to update the Group)    |
| OldGroupName | String                                                       | yes                                | Group Name of the Course (this will be the group name, if OldGroupName does not exist) |
| Tutor        | String                                                       | no (Defaults to NULL)              | Tutor of the Group                                                                     |
| Starttime    | String (HH:MM:SS 24h format)                                 | no (Defaults to CURRENT_TIMESTAMP) | Starttime of the Tutorial                                                              |
| Endtime      | String (HH:MM:SS 24h format)                                 | no (Defaults to CURRENT_TIMESTAMP) | Endtime of the Tutorial                                                                |
| Weekday      | String of ("Mo", "Di", "Mi", "Do", "Fr")                     | no (Defaults to "Mo")              | The weekday of the Tutorial                                                            |
| MaxUser      | INT (Must be larer than the assigned users in the Group)     | no (Defaults to 15)                | Maximum number of user who can join the group                                          |
| Room         | String (can be literally anything of 15 char or less lenght) | no (Defaults to "")                | Room of the Group                                                                      |

| Response                                                        | Describtion                                                          |
| --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `{error: { Weekday: "is too long"}}`                            | Weekday is too Long                                                  |
| `{error: { Weekday: 'has to be "Mo", "Di", "Mi", "Do", "Fr"'}}` | Weekday is not one of the allowed values                             |
| `{error: { Endtime: "wrong value"}}`                            | Endtime has a wrong format                                           |
| `{error: { Endtime: "out of boundaries"}}`                      | Endtime is not in the 24 h format                                    |
| `{error: { Starttime: "wrong value"}}`                          | Starttime has a wrong format                                         |
| `{error: { Starttime: "out of boundaries"}}`                    | Starttime is not in the 24 h format                                  |
| `{error: { GroupName: "already exists"}}`                       | GroupName you want to insert or update to already exists             |
| `{error: { GroupName: "must be defined"}}`                      | GroupName cannot be NULL                                             |
| `{error: { GroupName: "has wrong format"}}`                     | GroupName is not REGEX `"^[ÄÖÜäöüßA-Za-z0-9 ]{3,20}$"`               |
| `{error: { GroupName: "is too long"}}`                          | GroupName is too Long                                                |
| `{error: { Tutor: "login is too long"}}`                        | Tutor is too long                                                    |
| `{error: { Tutor: "does not exist"}}`                           | Tutor user does not exist                                            |
| `{error: { MaxUser: "cannot be decreased"}}`                    | MaxUser cannot be decreased because other users may be in that group |
| `{error: "wrong permissions or course not found"}`              | The user has not the Admin permission on that course                 |
| successfull                                                     | Group seccsessfully updated or inserted                              |

### POST /course/group/togglegroupvisibility

| Attribute | Type   | Required | Describtion            |
| --------- | ------ | -------- | ---------------------- |
| Semester  | String | yes      | Semester of the course |
| Name      | string | yes      | Name of the course     |

| Response                                                                    | Describtion                                                                |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `{error: {GroupVisible: "did not changed because GroupTimerActive was 1"}}` | GroupTimerActive is 1, either GroupVisibility or GroupTimerActive can be 1 |
| `{error: "wrong permissions or course not found"}`                          | The user has not the Admin permission on that course                       |
| successfull                                                                 | succsessfully toggled groupVisibility                                      |

### POST /course/group/togglegrouptimeractive

| Attribute | Type   | Required | Describtion            |
| --------- | ------ | -------- | ---------------------- |
| Semester  | String | yes      | Semester of the course |
| Name      | string | yes      | Name of the course     |

| Response                                                                       | Describtion                                                               |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `{error: {GroupTimerActive: "did not changed because GroupVisibility was 1"}}` | GroupVisibility is 1, either GroupVisibility or GroupTimerActive can be 1 |
| `{error: "wrong permissions or course not found"}`                             | The user has not the Admin permission on that course                      |
| successfull                                                                    | succsessfully toggled groupTimerActive                                    |

### POST /course/group/grouptimer

| Attribute | Type                           | Required                           | Describtion                           |
| --------- | ------------------------------ | ---------------------------------- | ------------------------------------- |
| Semester  | String                         | yes                                | Semester of the course                |
| Name      | string                         | yes                                | Name of the course                    |
| Time      | string (MYSQL Datetime format) | no (Defaults to CURRENT_TIMESTAMP) | time where the group assigment starts |

| Response                                           | Describtion                                            |
| -------------------------------------------------- | ------------------------------------------------------ |
| `{error: {GroupTimer: "has wrong date format"}}`   | GroupTimer does not fullfill the MYSQL DATETIME format |
| `{error: "wrong permissions or course not found"}` | The user has not the Admin permission on that course   |
| successfull                                        | succsessfully toggled groupTimerActive                 |

### POST /course/group/groupcontent

| Attribute | Type   | Required | Describtion            |
| --------- | ------ | -------- | ---------------------- |
| Semester  | String | yes      | Semester of the course |
| Name      | string | yes      | Name of the course     |

| Response    | Describtion                            |
| ----------- | -------------------------------------- |
| successfull | succsessfully toggled groupTimerActive |

An example response can be

```JSON
[
    {
        "GroupName": "Gruppe 1",
        "Tutor": "s0000002",
        "Ordering": 1,
        "Starttime": "15:27:07",
        "Endtime": "15:27:07",
        "Weekday": "Mo",
        "Maxuser": 15,
        "Room": ""
    },
    {
        "GroupName": "Gruppe 2",
        "Tutor": "s0000002",
        "Ordering": 2,
        "Starttime": "15:27:07",
        "Endtime": "15:27:07",
        "Weekday": "Mo",
        "Maxuser": 15,
        "Room": ""
    }
]
```

# Todo

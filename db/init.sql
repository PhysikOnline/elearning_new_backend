DROP TABLE IF EXISTS `GroupUser`;

DROP TABLE IF EXISTS `CoursePermissions`;

DROP TABLE IF EXISTS `Groups`;

DROP TABLE IF EXISTS `Course`;

DROP TABLE IF EXISTS `Semester`;

DROP TABLE IF EXISTS `User`;

DROP TABLE IF EXISTS `Sessions`;

CREATE TABLE `User` (
  `Login` char(8) NOT NULL,
  `password` char(41) NULL,
  PRIMARY KEY (`Login`)
);

CREATE TABLE `Semester` (
  `Semester` varchar(10) NOT NULL,
  `Ordering` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`Semester`),
  UNIQUE (`Ordering`)
);

CREATE TABLE `Course` (
  `Name` varchar(60) NOT NULL,
  `Semester` varchar(10) NOT NULL,
  `Description` LONGTEXT NULL,
  `GroupVisible` BOOLEAN NOT NULL default 0,
  `GroupTimerActive` BOOLEAN NOT NULL default 0,
  `GroupTimer` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Name`, `Semester`),
  FOREIGN KEY (`Semester`) REFERENCES `Semester`(`Semester`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (
    NOT (
      `GroupVisible`
      AND `GroupTimerActive`
    )
  )
);

CREATE TABLE `CoursePermissions` (
  `Name` varchar(60) NOT NULL,
  `Semester` varchar(10) NOT NULL,
  `Login` char(8) NOT NULL,
  `Permissions` varchar(6),
  PRIMARY KEY (`Name`, `Semester`, `Login`),
  FOREIGN KEY (`Name`, `Semester`) REFERENCES `Course`(`Name`, `Semester`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`Login`) REFERENCES `User`(`Login`) ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK (`Permissions` IN ('user', 'admin'))
);

CREATE TABLE `Groups` (
  `CourseName` varchar(60) NOT NULL,
  `Semester` varchar(10) NOT NULL,
  `GroupName` varchar(20) NULL,
  `Ordering` INT NOT NULL UNIQUE AUTO_INCREMENT,
  PRIMARY KEY (`CourseName`, `Semester`, `GroupName`),
  FOREIGN KEY (`CourseName`, `Semester`) REFERENCES `Course`(`Name`, `Semester`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `GroupUser` (
  `CourseName` varchar(60) NOT NULL,
  `Semester` varchar(10) NOT NULL,
  `GroupName` varchar(20) NOT NULL,
  `Login` char(8) NOT NULL,
  PRIMARY KEY (`CourseName`, `Semester`, `Login`),
  FOREIGN KEY (`Login`) REFERENCES `User`(`Login`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`CourseName`, `Semester`, `GroupName`) REFERENCES `Groups`(`CourseName`, `Semester`, `GroupName`) ON DELETE CASCADE ON UPDATE CASCADE
);
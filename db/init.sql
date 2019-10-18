DROP TABLE IF EXISTS `CoursePermissions`;
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
  PRIMARY KEY (`Name`, `Semester`),
  FOREIGN KEY (`Semester`) REFERENCES `Semester`(`Semester`)
);

CREATE TABLE `CoursePermissions` (
  `Name` varchar(60) NOT NULL,
  `Semester` varchar(10) NOT NULL,
  `Login` char(8) NOT NULL,
  `Permissions` varchar(6),
  PRIMARY KEY (`Name`, `Semester`, `Login`),
  FOREIGN KEY (`Name`, `Semester`) REFERENCES `Course`(`Name`, `Semester`) ,
  FOREIGN KEY (`Login`) REFERENCES `User`(`Login`),
  CHECK (`Permissions` IN ('user', 'admin'))
);



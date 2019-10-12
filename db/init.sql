DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Course`;
DROP TABLE IF EXISTS `Semester`;
DROP TABLE IF EXISTS `Sessions`;

CREATE TABLE `User` (
  `s-Nummer` char(8) NOT NULL,
  `password` char(41) NULL,
  PRIMARY KEY (`s-Nummer`)
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
  PRIMARY KEY (`Name`, `Semester`),
  FOREIGN KEY (`Semester`) REFERENCES `Semester`(`Semester`)
);


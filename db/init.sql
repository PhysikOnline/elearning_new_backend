DROP TRIGGER IF EXISTS GroupsisGroupFullInsertValidation;

DROP TRIGGER IF EXISTS GroupsisGroupFullUpdateValidation;

DROP TRIGGER IF EXISTS isGroupFullInsertValidation;

DROP TRIGGER IF EXISTS isGroupFullUpdateValidation;

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
  PRIMARY KEY (`Login`),
  CHECK(`Login` RLIKE "^[a-z0-9]{1,8}$")
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
  CONSTRAINT `constraint_GroupVisible_GroupTimerActive` CHECK (
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
  `GroupName` varchar(20) NOT NULL,
  `Tutor` char(8) NULL,
  `Ordering` INT NOT NULL UNIQUE AUTO_INCREMENT,
  `Starttime` TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Weekday` CHAR(2) NOT NULL DEFAULT "Mo",
  `Endtime` TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Maxuser` INT NOT NULL DEFAULT 3,
  `Room` varchar(15) NOT NULL DEFAULT "",
  PRIMARY KEY (`CourseName`, `Semester`, `GroupName`),
  FOREIGN KEY (`CourseName`, `Semester`) REFERENCES `Course`(`Name`, `Semester`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`Tutor`) REFERENCES `User`(`Login`) ON DELETE
  SET
    NULL ON UPDATE CASCADE,
    CONSTRAINT `constraint_GroupName` CHECK(
      `GroupName` RLIKE "^[ÄÖÜäöüßA-Za-z0-9 ]{3,20}$"
    ),
    CONSTRAINT `constraint_Starttime` CHECK(
      `Starttime` < "23:59:59"
      AND `Starttime` > "00:00:00"
    ),
    CONSTRAINT `constraint_Endtime` CHECK(
      `Endtime` < "23:59:59"
      AND `Starttime` > "00:00:00"
    ),
    CONSTRAINT `constraint_Weekday` CHECK(
      `Weekday` IN ("Mo", "Di", "Mi", "Do", "Fr")
    )
);

CREATE TRIGGER GroupsisGroupFullInsertValidation BEFORE
INSERT
  ON `Groups` FOR EACH ROW BEGIN IF (NEW.MaxUser) < (
    SELECT
      count(`Login`)
    FROM
      `GroupUser`
    WHERE
      `CourseName` = NEW.CourseName
      AND `Semester` = NEW.Semester
      AND `GroupName` = NEW.GroupName
  ) THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Group can not be decreased';

END IF;

END;

CREATE TRIGGER GroupsisGroupFullUpdateValidation BEFORE
UPDATE
  ON `Groups` FOR EACH ROW BEGIN IF (NEW.MaxUser) < (
    SELECT
      count(`Login`)
    FROM
      `GroupUser`
    WHERE
      `CourseName` = NEW.CourseName
      AND `Semester` = NEW.Semester
      AND `GroupName` = NEW.GroupName
  ) THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Group can not be decreased';

END IF;

END;

CREATE TABLE `GroupUser` (
  `CourseName` varchar(60) NOT NULL,
  `Semester` varchar(10) NOT NULL,
  `GroupName` varchar(20) NOT NULL,
  `Login` char(8) NOT NULL,
  PRIMARY KEY (`CourseName`, `Semester`, `Login`),
  FOREIGN KEY (`Login`) REFERENCES `User`(`Login`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`CourseName`, `Semester`, `GroupName`) REFERENCES `Groups`(`CourseName`, `Semester`, `GroupName`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER isGroupFullInsertValidation BEFORE
INSERT
  ON `GroupUser` FOR EACH ROW BEGIN IF (
    SELECT
      `MaxUser`
    FROM
      `Groups`
    WHERE
      `CourseName` = NEW.CourseName
      AND `Semester` = NEW.Semester
      AND `GroupName` = NEW.GroupName
  ) <= (
    SELECT
      count(`Login`)
    FROM
      `GroupUser`
    WHERE
      `CourseName` = NEW.CourseName
      AND `Semester` = NEW.Semester
      AND `GroupName` = NEW.GroupName
  ) THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Group is Full';

END IF;

END;

CREATE TRIGGER isGroupFullUpdateValidation BEFORE
UPDATE
  ON `GroupUser` FOR EACH ROW BEGIN IF (
    SELECT
      `MaxUser`
    FROM
      `Groups`
    WHERE
      `CourseName` = NEW.CourseName
      AND `Semester` = NEW.Semester
      AND `GroupName` = NEW.GroupName
  ) <= (
    SELECT
      count(`Login`)
    FROM
      `GroupUser`
    WHERE
      `CourseName` = NEW.CourseName
      AND `Semester` = NEW.Semester
      AND `GroupName` = NEW.GroupName
  ) THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Group is full';

END IF;

END;
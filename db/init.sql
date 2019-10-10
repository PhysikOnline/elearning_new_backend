DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `s-Nummer` char(8) NOT NULL,
  `password` char(41) NULL,
  PRIMARY KEY (`s-Nummer`)
);

DROP TABLE IF EXISTS `Sessions`;
INSERT INTO `User`
(`Login`, `password`)
VALUES
("s0000000", PASSWORD("s0000000")), ("s0000001", PASSWORD("s0000001")), ("s0000002", PASSWORD("s0000002"));


INSERT INTO `Semester`
(`Semester`, `Ordering`)
VALUES
("SoSe 19", 1),("WiSe 19/20", 2);


INSERT INTO `Course`
(`Name`,
`Semester`)
VALUES
("Grundlagen in Mobbing 2", "WiSe 19/20"),
("Opferdarstellung 1", "SoSe 19"),
("Grundlagen in Mobbing 1", "SoSe 19"),
("Opferdarstellung 2", "WiSe 19/20"),
("Psychologie der erfolgreichen Erpressung 1", "SoSe 19"),
("Gewaltsamer Überfall für Fortgeschrittene", "WiSe 19/20");

INSERT INTO `CoursePermissions`
(`Name`,
`Semester`, 
`Login`, 
`Permissions`)
VALUES
("Grundlagen in Mobbing 2", "WiSe 19/20", "s0000000", "admin"),
("Grundlagen in Mobbing 2", "WiSe 19/20", "s0000002", "user"),
("Opferdarstellung 1", "SoSe 19", "s0000000", "admin"),
("Grundlagen in Mobbing 1", "SoSe 19", "s0000000", "admin"),
("Opferdarstellung 2", "WiSe 19/20", "s0000000", "admin"),
("Psychologie der erfolgreichen Erpressung 1", "SoSe 19", "s0000000", "admin"),
("Psychologie der erfolgreichen Erpressung 1", "SoSe 19", "s0000002", "user"),
("Gewaltsamer Überfall für Fortgeschrittene", "WiSe 19/20", "s0000000", "admin");
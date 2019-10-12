INSERT INTO `User`
(`s-Nummer`, `password`)
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
("Opferdarstellung 2", "WiSe 19/20"),("Psychologie der erfolgreichen Erpressung 1", "SoSe 19");
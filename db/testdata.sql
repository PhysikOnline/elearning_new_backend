INSERT INTO
    `User` (`Login`, `password`)
VALUES
    ("s0000000", PASSWORD("s0000000")),
    ("s0000001", PASSWORD("s0000001")),
    ("s0000002", PASSWORD("s0000002")),
    ("s0000003", PASSWORD("s0000003")),
    ("s0000004", PASSWORD("s0000004")),
    ("s0000005", PASSWORD("s0000005")),
    ("s0000006", PASSWORD("s0000006")),
    ("s0000007", PASSWORD("s0000007")),
    ("s0000008", PASSWORD("s0000008"));

INSERT INTO
    `Semester` (`Semester`, `Ordering`)
VALUES
    ("SoSe 19", 1),("WiSe 19/20", 2);

INSERT INTO
    `Course` (`Name`, `Semester`, `Description`)
VALUES
    (
        "Opferdarstellung 1",
        "SoSe 19",
        "<p>Hier sollte eine schöne beschreibung stehen!!!</p>"
    ),
    (
        "Grundlagen in Mobbing 1",
        "SoSe 19",
        "<p>Hier sollte eine schöne beschreibung stehen!!!</p>"
    ),
    (
        "Opferdarstellung 2",
        "WiSe 19/20",
        "<p>Hier sollte eine schöne beschreibung stehen!!!</p>"
    ),
    (
        "Psychologie der erfolgreichen Erpressung 1",
        "SoSe 19",
        "<p>Hier sollte eine schöne beschreibung stehen!!!</p>"
    ),
    (
        "Gewaltsamer Überfall für Fortgeschrittene",
        "WiSe 19/20",
        "<p>Hier sollte eine schöne beschreibung stehen!!!</p>"
    );

INSERT INTO
    `Course` (
        `Name`,
        `Semester`,
        `Description`,
        `GroupVisible`,
        `GroupTimerActive`
    )
VALUES
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "<p>Hier sollte eine schöne beschreibung stehen!!!</p>",
        1,
        0
    );

INSERT INTO
    `CoursePermissions` (`Name`, `Semester`, `Login`, `Permissions`)
VALUES
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "s0000000",
        "admin"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "s0000002",
        "user"
    ),
    (
        "Opferdarstellung 1",
        "SoSe 19",
        "s0000000",
        "admin"
    ),
    (
        "Grundlagen in Mobbing 1",
        "SoSe 19",
        "s0000000",
        "admin"
    ),
    (
        "Opferdarstellung 2",
        "WiSe 19/20",
        "s0000000",
        "admin"
    ),
    (
        "Psychologie der erfolgreichen Erpressung 1",
        "SoSe 19",
        "s0000000",
        "admin"
    ),
    (
        "Psychologie der erfolgreichen Erpressung 1",
        "SoSe 19",
        "s0000002",
        "user"
    ),
    (
        "Gewaltsamer Überfall für Fortgeschrittene",
        "WiSe 19/20",
        "s0000000",
        "admin"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "s0000003",
        "user"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "s0000004",
        "user"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "s0000005",
        "user"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "s0000008",
        "user"
    );

INSERT INTO
    `Groups` (
        `CourseName`,
        `Semester`,
        `GroupName`,
        `Tutor`
    )
VALUES
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 1",
        "s0000001"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 2",
        "s0000001"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 3",
        "s0000001"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 4",
        "s0000001"
    );

INSERT INTO
    `GroupUser` (
        `CourseName`,
        `Semester`,
        `GroupName`,
        `Login`
    )
VALUES
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 1",
        "s0000002"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 1",
        "s0000003"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 1",
        "s0000004"
    ),
    (
        "Grundlagen in Mobbing 2",
        "WiSe 19/20",
        "Gruppe 3",
        "s0000005"
    );
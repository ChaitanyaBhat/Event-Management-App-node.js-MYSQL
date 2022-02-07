let createDbQery = "CREATE DATABASE IF NOT EXISTS event_management;";
// event_db

let createEventsTable = `CREATE TABLE IF NOT EXISTS Events(
                        event_id INTEGER PRIMARY KEY AUTO_INCREMENT,
                        event_name VARCHAR(50) NOT NULL,
                        event_date DATE NOT NULL,
                        event_time TIME NOT NULL, 
                        venue VARCHAR(50) NOT NULL,
                        reg_last_date DATE NOT NULL,
                        description VARCHAR(100),
                        status VARCHAR(20) NOT NULL DEFAULT 'Add Result'           
                        );`;
//wrong spell Description 

let createRegistratiionTable = `CREATE TABLE IF NOT EXISTS Registration(
                                reg_id INTEGER PRIMARY KEY AUTO_INCREMENT,
                                event_id INTEGER NOT NULL,
                                name VARCHAR(30) NOT NULL,
                                class VARCHAR(20) NOT NULL,
                                contact_no VARCHAR(10) NOT NULL,
                                email VARCHAR(50) NOT NULL,
                                FOREIGN KEY(event_id) REFERENCES Events(event_id)
                                ON DELETE CASCADE ON UPDATE CASCADE
                                );`;

let createResultTable = `CREATE TABLE IF NOT EXISTS Result(
                        result_id INTEGER PRIMARY KEY AUTO_INCREMENT,
                        event_id INTEGER NOT NULL,
                        reg_id INTEGER NOT NULL,
                        result VARCHAR(20) NOT NULL DEFAULT 'Participated',
                        FOREIGN KEY(event_id) REFERENCES Events(event_id)
                        ON DELETE CASCADE ON UPDATE CASCADE,
                        FOREIGN KEY(reg_id) REFERENCES Registration(reg_id)
                        ON DELETE CASCADE ON UPDATE CASCADE
                        );`;

let createCertificateTable = `CREATE TABLE certificate (
                                id BINARY(16) PRIMARY KEY,
                                name VARCHAR(255)
                            );`;

let insertCertificate = `INSERT INTO certificate(id, name)
                        VALUES(UUID_TO_BIN(UUID()),'John.png'),
                        (UUID_TO_BIN(UUID()),'Will.jpg'),
                        (UUID_TO_BIN(UUID()),'Mary.svg');`;

let selectCertificate = `SELECT 
                        BIN_TO_UUID(id) id, 
                        name
                        FROM
                        certificate;`;

// let createStudentsTable = `CREATE TABLE IF NOT EXISTS Students(
//                             Id INTEGER PRIMARY KEY AUTO_INCREMENT,
//                             Name VARCHAR(30) NOT NULL,
//                             Class VARCHAR(10) NOTNULL,
//                             Contact_no INTEGER,
//                             Email VARCHAR(30)
//                             );`;

// let alterRegistation = `ALTER TABLE Registration MODIFY Contact_no VARCHAR(10) NOT NULL;`; 

let insertEvent = `INSERT INTO 
                    Events(event_name, event_date, event_time, venue, description, reg_last_date) 
                    VALUES
                    ("TechExpo 2020", "20-11-03", "11:00:00", "IIT Guwahati", "Sceince exhibition and competition", "20-11-01"),
                    ("Entrepreneurial Extravaganza", "20-12-26", "09:30:00", "E-cell IIT Kanpur, UP", "Indias biggest virtual entrepreneurial event", "20-12-21"),
                    ("Trishul'20", "20-12-01", "10:30:00", "Srinagar, Uttarakhand", "The Tech-Carnival", "20-11-30"),
                    ("Interface 2020", "20-12-22", "11:00:00", "BITS Pilani, Rajastan", "43rd edition of the annual management fest", "20-12-20");`

let insertEventTable = `INSERT INTO 
                    Events(event_name, event_date, event_time, venue, description, reg_last_date, status) 
                    VALUES
                    ("Python Workshop", "20-10-09", "10:00:00", "MIRAI Academy, Chennai", "One day technical workshop", "20-10-08", 'Show Result');`;

let insertRegistration = `INSERT INTO
                        Registration(event_id, name, class, contact_no, email)
                        VALUES
                        (3, "Shivaraj Singh Rathod", "BE V sem", "8738543209", "ssr@gmail.com"),
                        (1, "Shivaraj Singh Rathod", "BE V sem", "8738543209", "ssr@gmail.com"),
                        (3, "Harish Raj", "BCA IV sem", "7654892439", "hraj@gmail.com"),
                        (2, "Surabhi Gautam", "BE V sem", "9078645678", "surabhig@gmail.com"),
                        (1, "Hani Singh", "BSc VI sem", "8998787887", "hanisingh@gmail.com"),
                        (3, "Surabhi Gautam", "BE V sem", "7654567765", "surabhig@gmail.com"),
                        (5, "Manav Deshmukh", "MCA I sem", "9867566587", "dmanav@gmail.com"),
                        (5, "Kalpana Mahesh", "MBA IV sem", "8765438958", "kalpanam@gmail.com"),
                        (4, "Hani Singh", "BSc VI sem", "8998787887", "hanisingh@gmail.com");`;

insertRegistration = `INSERT INTO
                        Registration(event_id, name, class, contact_no, email)
                        VALUES
                        (2, "Shivaraj Singh", "BE III sem", "8745843209", "ssingh@gmail.com"),
                        (4, "Mahesh Bhat", "MCA IV sem", "8776348958", "maheshbhat@gmail.com"),
                        (5, "Rajesh Agarwal", "BCA IV sem", "9854892439", "rajagarwal@gmail.com");`;

let insertResult = `INSERT INTO
                    Result(reg_id, event_id, result)
                    VALUES
                    (8, 5, "Winner"),
                    (7, 5, "I Runner-up");`;

                    // `(4, 2, "Winner"),
                    // (10, 2, "Participation"),
                    // (3, 3, "Winner"),
                    // (6, 3, "I Runner-up"),
                    // (1, 3, "II Runner-up"),
                    // (9, 4, "Participation"),
                    // (11, 4, "Participation"),
                    // (8, 5, "Winner"),
                    // (7, 5, "Participation"),
                    // (12, 5, "Participation");`;

let selectRegistered = `SELECT R.Name,  E.Event_name, E.Event_date FROM 
                        Events E 
                        INNER JOIN 
                        Registration R 
                        ON E.Id = R.Event_id ORDER BY E.Id;`;


let selectResult = `SELECT Rt.Name, Rt.Class, R.Status FROM 
                    Registration Rt 
                    INNER JOIN 
                    Result R  
                    ON Rt.Id = R.Reg_id ORDER BY R.Id;`;

let certificateData = `SELECT Rg.Name, Rg.Class, R.Status, E.Event_name, E.Venue, E.Event_date 
                        FROM Registration Rg 
                        INNER JOIN Result R 
                        ON Rg.Id = R.Reg_id 
                        INNER JOIN Events E 
                        ON Rg.Event_id = E.Id;`;

let certificateData1 = `SELECT Rg.Name, Rg.Class, R.Status, E.Event_name, E.Venue, E.Event_date 
                        FROM Registration Rg 
                        INNER JOIN Result R ON Rg.Id = R.Reg_id 
                        INNER JOIN Events E ON Rg.Event_id = E.Id 
                        WHERE Rg.Email = 'surabhig@gmail.com' AND E.Event_name = 'TechExpo 2020';`;
                        
let except_winner = `if (winner_id != "" && runner1_id != "" && runner2_id != "") {
                            let values = [[event_id, winner_id, "Winner"], [event_id, runner1_id, "I Runner Up"], [event_id, runner2_id, "II Runner Up"]];
                        }`

let except_winner_runner = `mysql> select reg_id,event_id, name from Registration WHERE event_id = 6 AND NOT reg_id = 25 AND NOT reg_id = 22;`

                        // ALTER TABLE Result CHANGE 'status' 'result' VARCHAR(20) NOT NULL;
                        // show columns in Result;
                        // mysql> ALTER TABLE Events ADD COLUMN status VARCHAR(15) AFTER description;

                        // ALTER TABLE Events CHANGE 'status' 'status' VARCHAR(15) NOT NULL DEFAULT 'Add Result';

                        // mysql> ALTER TABLE Events MODIFY status VARCHAR(15) DEFAULT 'Add Result';

                        // DROP DATABASE event_db;

                        // CREATE DATABASE event_db;
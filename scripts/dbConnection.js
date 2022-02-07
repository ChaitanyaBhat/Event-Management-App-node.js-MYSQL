var mysql = require("mysql");

let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cane1.Physics",
    database: "event_db"
});
// database: "event_management"

conn.connect(function(err) {
    if(err) throw err;
    console.log("Connected to the Database");
});

module.exports = conn;
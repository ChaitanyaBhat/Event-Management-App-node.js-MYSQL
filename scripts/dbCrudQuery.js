var conn = require("./dbConnection.js");
// const e = require("express");

function fetchEvents(callback) {
    let sql = `SELECT *, DATE_FORMAT(event_date, '%d/%m/%y') AS event_date, 
                TIME_FORMAT(event_time, '%h:%i %p') AS event_time, 
                DATE_FORMAT(reg_last_date, '%d/%m/%y') AS reg_last_date FROM Events 
                WHERE reg_last_date >= CURDATE() ORDER BY event_date DESC;`;
    conn.query(sql, function(err, result, field) {
        if(err) throw err;
        result = JSON.stringify(result);
        console.log("result",result);
        return callback(result);
    });
}


function insertEvent(req, callback) {
    let event_name = req.body.event_name;
    let event_date = req.body.event_date;
    let event_time = req.body.event_time;
    let venue = req.body.venue;
    let description = req.body.description;
    let reg_last_date = req.body.reg_last_date;
    console.log(event_name, event_date, event_time, venue, description, reg_last_date);
    let sql = "INSERT INTO Events(event_name, event_date, event_time, venue, description, reg_last_date) VALUES ?;";
    let values = [[event_name, event_date, event_time, venue, description, reg_last_date]];
    conn.query(sql, [values], function(err, result) {
        let data = {
                    result: "Event",
                    text: " insertion is unsuccessful! Please Try again",
                    btnText: "Add Event"
                    }
        if(err) {
        console.log("err",err);
        return callback(data);
        }
        else {
            console.log("result", result);
            data.text = " is added successfully";
            return callback(data);
        }
    });
    // console.log("Got Data");
    // return callback("got data");
}


function registerStd(req, callback) {
    // let dateObj = new Date();
    // let currentDate = dateObj.getFullYear() + "-" + dateObj.getMonth() + "-" + dateObj.getDate();

    let reg_id = req.body.reg_id;
    let std_name = req.body.std_name;
    let std_class = req.body.std_class;
    let event_name = req.body.event_name;
    let event_id = Number(req.body.event_id);
    let contact = req.body.contact;
    let email = req.body.email;
    console.log(reg_id, std_name, std_class, event_name, event_id, contact, email);
    let sql = "INSERT INTO Registration(event_id, name, class, contact_no, email) VALUES ?;";
    let values = [[event_id, std_name, std_class, contact, email]];
    // console.log("Got Data");
    conn.query(sql, [values], function(err, result, fields) {
        let data = {
            result: "Registration",
            text: " is unsuccessful! Please Try again",
            btnText: "Registrer"
            }
        if(err) {
            console.log("err",err);
            return callback(data);
        }
        else{
            console.log("result", result, fields);
            data.text = " is successful"
            return callback(data);
        }
    });
}

function registeredStds(req, callback) {
    let event_id = req.body.event_id;

    // let event_id = req.query.event_id;
    let sql = `SELECT reg_id, name from Registration WHERE event_id = ${event_id} ORDER BY name;`;
    conn.query(sql, function(err, result) {
        if(err) throw err;
        result = JSON.stringify(result);
        console.log("registeredStds", result);
        return callback(result);
    })
}

function fetchNoResultEvents(callback) {
    let sql = `SELECT *, DATE_FORMAT(event_date, '%d/%m/%y') AS event_date,
                TIME_FORMAT(event_time, '%h:%i %p') AS event_time 
                FROM Events WHERE status = 'Add Result' AND event_date <= CURDATE() ORDER BY event_date;`;
    conn.query(sql, function(err, result, field) {
        if(err) throw err;
        result = JSON.stringify(result);
        console.log("result",result);
        return callback(result);
    });
}

// async function insertResult(req, callback) {
//     let event_name = req.body.event_name;
//     let event_id = req.body.event_id;
//     let winner_id = req.body.winner_id;
//     let runner1_id = req.body.runner1_id;
//     let runner2_id = req.body.runner2_id;
//     console.log(event_name, event_id, winner_id, runner1_id, runner2_id);

//     let data = {
//         result: "Results",
//         text: " insertion is unsuccessful! Please Try again",
//         btnText: "Add Result"
//         }

//     let sql1 = "INSERT INTO Result(event_id, reg_id, result) VALUES ?;";
//     if (winner_id != "" && runner1_id != "" && runner2_id != "") {
//         let values = [[event_id, winner_id, "Winner"], [event_id, runner1_id, "I Runner Up"], [event_id, runner2_id, "II Runner Up"]];
//         data = await insertWinner(data, sql1, values);
//     }
//     else if (winner_id != "" && runner1_id != "") {
//         let values = [[event_id, winner_id, "Winner"], [event_id, runner1_id, "I Runner Up"]];
//         data = await insertWinner(data, sql1, values);
//     }
//     else if (winner_id != "") {
//         let values = [[event_id, winner_id, "Winner"]];
//         data = await insertWinner(data, sql1, values);
//     }
     
//     let result = await insertParticipated(event_id, winner_id, runner1_id, runner2_id);
    
//     // conn.query(sql1, [values], function(err, result) {
//     //     let data = {
//     //                 result: "Results",
//     //                 text: " insertion is unsuccessful! Please Try again",
//     //                 btnText: "Add Result"
//     //                 }
//     //     if(err) {
//     //         console.log("err",err);
//     //         return callback(data);
//     //     }
//     //     else{
//     //         console.log("result1", result);
//     //         data.text = " is added successfully"
//     //         // return callback(data);
//     // //     }
//     // // });

//     //     //update event status:
//     //     let sql2 = `UPDATE Events SET status = 'Show Result' WHERE Event_id = ${eventId};`;
//     //     conn.query(sql2, function(err, result) {
//     //         if(err) {
//     //             console.log("err updating Event", err);
//     //         }
//     //         else {
//     //             console.log("result2", result);
//     //         }
//     //     })
//     //     // console.log("Got Data");
//     //     // return callback("got data");
        
//     //     return callback(data);    
//     //     }
//     // });
//     console.log('data-------------------------', data);
//     return callback(data);    
// }

// async function insertWinner(data, sql1, values) {
//     console.log("sql1", sql1, "values", values);

//     data = await conn.query(sql1, [values], async function(err, result1) {
//         if(err) {
//             console.log('w---------------------------------------', data);
//             console.log("err",err);
//             return data;
//         }
//         else{
//             console.log('ww-------------------------------------', data);
//             console.log("insertWinner", result1);
//             data.text = " is added successfully"
//             // return callback(data);
//     //     }
//     // });

//         //update event status:
//         let sql2 = `UPDATE Events SET status = 'Show Result' WHERE Event_id = ${eventId};`;
//         let result = await conn.query(sql2, function(err, result2) {
//             if(err) {
//                 console.log("err updating Event", err);
//                 return err;
//             }
//             else {
//                 console.log("UPDATE result2", result2);
//                 return result2;
//             }
//         })
//         // console.log("Got Data");
//         // return callback("got data");
//         console.log('www---------------------------', data);
//         return data;    
//         }
//     });
//     return data;
// }

// async function insertParticipated(event_id, winner_id, runner1_id, runner2_id) {
//     let sql3 = `select reg_id from Registration 
//     WHERE event_id = ${event_id} AND NOT reg_id = ${winner_id} 
//     AND NOT reg_id = ${runner1_id} AND reg_id = ${runner2_id};`;
//     let result = await conn.query(sql3, function(err, result3) {
//         if(err) throw err;
//         let participated_stds = result3;
//         console.log("participated_stds==================",result3);

//         participated_stds.map(participated_std => {
//             conn.query(`INSERT INTO Result(event_id, reg_id) 
//             VALUES (${event_id}, ${participated_std.reg_id});`, function(err, result4) {
//                 if(err) throw err;
//                 console.log("participated_stds--------------",result4);
//             });
//         });
//         return result3;    
//     });
//     return result;
// }





async function insertResult(req, callback) {
    let event_name = req.body.event_name;
    let event_id = req.body.event_id;
    let winner_id = req.body.winner_id;
    let runner1_id = req.body.runner1_id;
    let runner2_id = req.body.runner2_id;
    console.log(event_name, event_id, winner_id, runner1_id, runner2_id);

    let data = {
        result: "Results",
        text: " insertion is unsuccessful! Please Try again",
        btnText: "Add Result"
        }

    if (winner_id != "" && runner1_id != "" && runner2_id != "") {
        let values = [[event_id, winner_id, "Winner"], [event_id, runner1_id, "I Runner Up"], [event_id, runner2_id, "II Runner Up"]];
        data = await insertWinner(data, values);
    }
    else if (winner_id != "" && runner1_id != "") {
        let values = [[event_id, winner_id, "Winner"], [event_id, runner1_id, "I Runner Up"]];
        data = await insertWinner(data, values);
    }
    else if (winner_id != "") {
        let values = [[event_id, winner_id, "Winner"]];
        data = await insertWinner(data, values);
    }
        
    let participated_stds = await participatedStds(event_id, winner_id, runner1_id, runner2_id);
    
    console.log('data-------------------------', data);
    return callback(data);
}

async function insertWinner(data, values) {
    let sql1 = "INSERT INTO Result(event_id, reg_id, result) VALUES ?;";
    console.log("sql1", sql1, "values", values);

    data = await conn.query(sql1, [values], function(err, result1) {
        if(err) {
            console.log('w---------------------------------------', data);
            console.log("err",err);
            return data;
        }
        else{
            console.log('ww-------------------------------------', data);
            console.log("insertWinner", result1);
            data.text = " is added successfully"
            let result2 = updateStatus(values[0][0]);
            return data;
        }
    });
    return data;
}

async function updateStatus(event_id) {
     //update event status:
     let sql2 = `UPDATE Events SET status = 'Show Result' WHERE Event_id = ${event_id};`;
     let result2 = await conn.query(sql2, function(err, result2) {
         if(err) {
             console.log("err updating Event", err);
             return err;
         }
         else {
             console.log("UPDATE result2", result2);
             return result2;
         }
     });
     return result2
}

async function participatedStds(event_id, winner_id, runner1_id, runner2_id) {
    let sql3 = `select reg_id from Registration 
    WHERE event_id = ${event_id} AND NOT reg_id = ${winner_id} 
    AND NOT reg_id = ${runner1_id} AND reg_id = ${runner2_id};`;
    let participated_stds = await conn.query(sql3, function(err, result3) {
        if(err) {
            console.log("err participatedStds fetch", err);
            return err;
        }
        else {
        // let participated_stds = result3;
        console.log("participated_stds==================",result3, result3.reg_id);
        let result4 = insertParticipated(event_id, result3)
        return result3;
        }
    });
    return participated_stds;
}

async function insertParticipated(event_id, participated_stds) {
    participated_stds.map(participated_std => {
        let result4 = conn.query(`INSERT INTO Result(event_id, reg_id) 
        VALUES (${event_id}, ${participated_std.reg_id});`, function(err, result4) {
            if(err) {
                console.log("err participatedStds insert", err);
                return err;
            }
            else { 
                console.log("participated_stds--------------",result4);
                return result4;
            }
        });
    });
}





async function insertAllParticipated(req, callback) {
    let event_id = req.body.event_id;
    
    let event_ids = await searchEventId(event_id);
    // event_ids = JSON.parse(event_ids);
    console.log("event_ids--------------",event_ids);

    let participated = await ppp(event_id, event_ids, callback);
    console.log("participated_stds...........", participated);
    // return callback(participated);
}

async function searchEventId(event_id) {
    let sql1 = `select event_id from Result where event_id = 6;`
    conn.query(sql1, function(err, result1) {
        if(err) {
            console.log("err get event_ids", err);
            return err;
        }
        else {
            // result1 = JSON.stringify(result1); 
            console.log("event_ids.........",result1);
            return result1;
        }
    });
}

async function ppp(event_id, event_ids, callback) {
    console.log(event_ids, typeof(event_ids), "---------");
    
    if(event_ids != []) {
        let sql = `INSERT INTO Result (event_id, reg_id) 
        SELECT event_id, reg_id FROM Registration
        WHERE event_id = ${event_id};`
        conn.query(sql, function(err, result) {
        if(err) {
            console.log("err participatedStds insert", err);
            return err;
        }
        else { 
            console.log("participated_stds--------------",result);
            // return result;
            return callback(result)
            }
        });
    }
    
}





function fetchResultEvents(callback) {
    let sql = `SELECT *, DATE_FORMAT(event_date, '%d/%m/%y') AS event_date, 
                TIME_FORMAT(event_time, '%h:%i %p') AS event_time FROM Events 
                WHERE status = "Show Result" ORDER BY event_date DESC;`;
    conn.query(sql, function(err, result) {
        if(err) {
            console.log("Result event err", err);
        }
        else {
            console.log("result Event", result);
            result = JSON.stringify(result);
            return callback(result)
        }
    });
}


function fetchResult(req, callback) {
    let event_id = req.body.event_id;
    let event_name = req.body.event_name;
    let sql = `SELECT Reg.reg_id, E.event_name, 
                DATE_FORMAT(E.event_date, '%d/%m/%y') AS event_date, 
                E.venue, Reg.name, Reg.class, Reg.email, R.result FROM Events E 
                INNER JOIN Registration Reg ON E.event_id = Reg.event_id 
                INNER JOIN Result R ON Reg.reg_id = R.reg_id 
                WHERE R.event_id = ${event_id} ORDER BY R.result_id;`;
    conn.query(sql, function(err, result, fields) {
        if(err) throw err;
        console.log("fetchResult", result);
        result = JSON.stringify(result);
        return callback(result);
    });
}


// function showCertificate(req, callback) {
//     let event_id = req.body.event_id;
//     let event_name = req.body.event_name;
// }

function checkResult(req, callback) {
    let email = req.body.email;
    let eventName = req.body.eventName;
    let sql = `SELECT R.Email,  E.Event_name FROM Events E 
                INNER JOIN Registration R ON E.Id = R.Event_id ORDER BY E.Id;`;
    conn.query(sql, function(err, result, fields) {
        if(err) throw err;
        console.log("result",result);
        console.log(email,eventName,result[0].Email,result[1].Event_name);
        for(let i = 0; i < result.length; i++) {
            if(result[i].Email == email && result[i].Event_name == eventName) {
                console.log("Logged in successfully");
                let certificateData = `SELECT Rg.Name, Rg.Class, R.Status, E.Event_name, E.Venue, E.Event_date 
                        FROM Registration Rg 
                        INNER JOIN Result R 
                        ON Rg.Id = R.Reg_id 
                        INNER JOIN Events E 
                        ON Rg.Event_id = E.Id 
                        WHERE Rg.Email = '${email}' AND E.Event_name = '${eventName}';`;
                conn.query(certificateData, function(err, result2, fields) {
                    if(err) throw err;
                    console.log(result2);
                    let data = {
                        result: result2[0].Status,
                        text: "",
                        btnText: "Generate Certificate",
                        stdName: result2[0].Name,
                        stdClass: result2[0].Class,
                        college: "xyz College",
                        event: result2[0].Event_name,
                        venue: result2[0].Venue,
                        eventDate: result2[0].Event_date,
                        resultDate: "1-1-2020",
                        signature: "abcd abcd"
                    };
                    return callback(data, "success");
                });
            }
        }
    });
}

function fetchEventNames(callback) {
    // let sql = "SELECT event_id, event_name FROM Events ORDER BY event_date;";
    // conn.query(sql, function(err, result, fields) {
    //     if(err) throw err;
    //     result = JSON.stringify(result);
    //     console.log("result",result);
    //     return callback(result);
    // });
}

// module.exports = fetchData;

module.exports = {
    getEvents:fetchEvents, 
    getEventNames: fetchEventNames,
    registerStd: registerStd,
    registeredStds: registeredStds,
    addEvent: insertEvent,
    addResult: insertResult,
    checkResult: checkResult,
    fetchNoResultEvents: fetchNoResultEvents,
    insertAllParticipated: insertAllParticipated,
    fetchResultEvents: fetchResultEvents,
    fetchResult: fetchResult,
};
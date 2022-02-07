var express = require("express");
var app = express();

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
// const multer = require('multer') // v1.0.5
// const upload = multer() // for parsing multipart/form-data

app.use(fileUpload())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set("view engine", "ejs");
app.use(express.static("views"));

var session = require("express-session");
app.use(session({secret: "pranavashree", saveUninitialized:true, resave:true}));

var authenticate = function(req, res, next) {
    if(req.session.user_name && req.session.password) {
        next();
    }
    else {
        return res.status(401).send("You are not logged in!");
    }
}

app.use("/admin", authenticate);

// var eventDetails = require("./events.js");
// var eventNames = require("./registration.js");
const dbQueryModules = require("./scripts/dbCrudQuery.js");
// const { checkResult } = require("./scripts/dbCrudQuery.js");
const fetchEvents = dbQueryModules.getEvents;
const fetchEventNames = dbQueryModules.getEventNames;
const registerStd = dbQueryModules.registerStd;
const registeredStds =dbQueryModules.registeredStds;
const insertEvent = dbQueryModules.addEvent;
const insertResult = dbQueryModules.addResult;
const checkResult = dbQueryModules.checkResult;
const fetchNoResultEvents = dbQueryModules.fetchNoResultEvents;
const insertAllParticipated =dbQueryModules.insertAllParticipated;
const fetchResultEvents = dbQueryModules.fetchResultEvents;
const fetchResult = dbQueryModules.fetchResult;
       

app.post("/login", function(req, res) {
    req.session.user_name = req.body.user_name;
    req.session.password = req.body.password;
    res.redirect("/login");
});

app.get("/login", function(req, res) {
    if(req.session.user_name && req.session.password) {
        return res.redirect("/admin");
    }
    res.render("admin_login");
});

app.get("/logout", function(req, res) {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        console.log("req.session", req.session);
        res.redirect("/");
    });
});

app.all("/", function(req, res) {
    res.render("index");
});


app.get("/home", function(req, res) {
    res.redirect("/");
});


app.get('/events', function(req, res) {
    fetchEvents(function(fetchedData) {
        var result = JSON.parse(fetchedData);
        console.log("result event",result)
        res.render("events", {data: result});
    });
});


app.get("/admin", function(req, res) {
    res.render("admin");
});


app.post("/admin/add-event", function(req, res){
    console.log(req.body);
    insertEvent(req, function(responseData) {
        console.log(responseData);
        res.render("result", {data: responseData});
    });
});


app.post('/event', function (req, res) {
    console.log("req.body", req.body)
    res.render("registration", {data:req.body});
});


app.post("/register", function(req, res) {
    console.log("req.body reg", req.body);
    registerStd(req, function(responseData) {
        console.log(responseData);
        // toastr.success('The process has been saved.', 'Success');
        res.render("result", {data: responseData});
    });
})


app.get("/registered-stds", function(req, res) {
    console.log("event registered", req.query.event_id);
    registeredStds(req, function(responseData) {
        let result = JSON.parse(responseData);
        console.log("...........",result);
        res.json(result);
    })
})

app.get('/admin/no-result-events', function(req, res) {
    fetchNoResultEvents(function(fetchedData) {
        var result = JSON.parse(fetchedData);
        console.log("no result event",result)
        // res.end();
        res.render("no_result_events", {data: result});
    });
});

app.post("/add-result", function(req, res){
    console.log("req.body", req.body)
    // insertAllParticipated(req, function(fetched_data) {
    //     console.log("fetched_data", fetched_data);
    //     res.render("add_result", {data:req.body});
    // })
    registeredStds(req, function(responseData) {
        let result = JSON.parse(responseData);
        console.log("...........",result);
        res.render("add_result", {data:result});
    });
});

app.post("/insert-result", function(req, res){
    console.log(req.body);
    insertResult(req, function(responseData) {
        console.log(responseData);
        res.render("result", {data: responseData});
    });
});


app.get('/show-result-events', function(req, res) {
    fetchResultEvents(function(fetchedData) {
        var result = JSON.parse(fetchedData);
        console.log("result event",result)
        res.render("show_result_events", {data: result});
    });
});

app.post('/show-result', function(req, res) {
    console.log("req for show result", req.body);
    fetchResult(req, function(fetched_data) {
        var result  = JSON.parse(fetched_data);
        console.log(result);
        res.render('show_result', {data: result});
    })
})

app.get("/result", function(req, res) {
    // let data = {
    //             result: "Nothing to show!",
    //             text: "",
    //             btnText: "Back to home"
    //             }
    let responseData = {
                result: "Winner",
                text: "",
                btnText: "Generate Certificate"
                }
    res.render("result", {data: responseData});
});


app.post("/home", function(req, res) {
    // getStdResult(req, function(responseData) {
    checkResult(req, function(responseData, resultStr) {
        console.log(responseData);
        if(resultStr == "success") {
            res.render("result", {data: responseData});
        }
        else {
            let data = {
                result: "Email/Event name is invalid!",
                text: "Please Try again.",
                btnText: "Back to Home"
                }
            res.render("result", {data: data});
        }
    });
});

app.get("/canvas", function(req, res) {
    res.render("trial");
})

app.post("/admin/upload-cert", function(req, res) {
    console.log("got img", req.files.img_file);
    let img_details = req.files.img_file;
    console.log(img_details.name)

    img_details.mv(__dirname + '/certifiicates/' + img_details.name, function(err) {
        if(err){
          console.log(err);
        }else{
       console.log("uploaded");
   }
      });
    res.end();
})

app.get("/certificate", function(req, res) {
    res.render("certificate");
})
app.post("/certificate", function(req, res) {
    // showCertificate(req, function(responseData) {
    //     console.log(responseData);
    //     res.render("certificate", responseData)
    // });
    console.log("certificate",req.body);
        res.render("certificate", {data: req.body});
})


app.listen(5000, function() {
    console.log("Listening to port 5000");
});


// app.get("/home", function(req, res) {
//     res.sendFile("views/index.html", {root: __dirname});
// });

// app.get('/events', function(req, res) {
//     res.sendFile(__dirname + "/views/events.html");
//   });

// app.get('/register', function (req, res) {
//     res.sendFile(__dirname + '/views/registration.html');
// });


// app.post("/result", function(req, res) {
//     // getStdResult(req, function(responseData) {
//     checkResult(req, function(responseData) {
//         console.log(responseData);
//         // let data = {
//         //             result: responseData.result,
//         //             text: responseData.text,
//         //             btnText: responseData.btnText
//         //             };
//         if(responseData == "success") {
//             res.render("result", {data: responseData});
//         }
//         else {
//             res.render("index", {data: responseData});
//         }
//     });
// });
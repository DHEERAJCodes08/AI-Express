var pool = require("./db");
const express = require("express");
const path = require("path");
const env = require("env");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
require("dotenv").config();

var app = express();
// app.set("view engine", "ejs");

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session is Create here
app.use(
  session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
  })
);

console.log("Session created Succefully!");

// Routes
app.get("/", function (req, res) {
  res.redirect("Home.html");
});

app.get("/Login", function (req, res) {
  if (req.session.isLoggedIn) {
    res.redirect("Home.html");
  } else {
    res.redirect("Login.html");
  }
});

app.get("/userProfile", function (req, res) {
  if(req.session.isLoggedIn) {
    res.redirect("userProfile.html")
  } else {
    res.redirect("SingUp.html")
  }
});


//Establish database connection
pool.connect(function (error, res) {
  if (error) throw error;
  console.log("database connection established");
});



app.post("/SingUp.html", async (req, res) => {
  // user registration
  var user = req.body.name;
  var password = req.body.password;

  console.log(user, password);

  var sql =
    "INSERT INTO userlogin (name, password) VALUES('" +
    user +
    "', '" +
    password +
    "')";

  pool.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Successfully Account Created");
    res.redirect("Login.html");
  });
});

// Handle the login request
app.post("/Login.html", async (req, res) => {
  const { name, password } = req.body;

  // Query to check if the name and password match  ,,this is Query object
  const query = {
    text: "SELECT COUNT(*) AS count FROM userlogin WHERE name = $1 AND password = $2",
    values: [name, password],
  };

  pool
    .query(query)
    .then((result) => {
      const count = result.rows[0].count;
      if (count === "1") {
        // Successful authentication
        console.log("Successfully logged in");

        req.session.isLoggedIn = true; // Set isLoggedIn in session so that the Session Comes to Known
        console.log("Session Marked In");

        if (true) {
          console.log("userprofile loaded successfully");
        }
        console.log("user Id :" + name + " " + "pass :" + password);
        res.redirect("Home.html");
      } else if (count === "0") {
        res.send("Invalid email or password");
      } else {
        // Invalid credentials
        res.send("No user found using this Email");
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.status(500).send("Internal server error");
    });
});




// Your authentication middleware Which makes the Single Button Work Two Ways By the Help of Authentication Status
// 1) the next() function is called to  move to the Next MiddleWare  ie app.get("/check-auth-status", isAuthenticated, (req, res)
// 2) if the req.session.isLoggedIn is true  the we call next() function
// 3)then at the route /check-auth-status  we  Pass the Status = 200
// 4)this status is then Checked in the Profile.js ie userSide , and necessary Operation is performed according to that status
// 5) if the user was not authenticated then we pass the status = 401 to the route /check-aut... , and then it is fetched through the userside in profile.js and necessary Operation are performed according to that status
function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    return next(); // User is authenticated, continue to the next middleware
  } else {
    return res.sendStatus(401); // User is not authenticated, return 401 Unauthorized status
  }
}

// Route to check authentication status
// it Points here When we call the Next Middleware function
app.get("/check-auth-status", isAuthenticated, (req, res) => {
  // If the request reaches here, it means the user is authenticated
  res.sendStatus(200); // Return 200 OK status
});

app.post("/userProfile.html" , async (req, res) => {


//Grabing the Values from the  form
  const {fullname,email,phone,gender,address,work,DOB} = req.body;

  console.log(fullname, email, phone, gender, address, work,DOB)
    //Creating the Query to Store the Data 
  const infoquery = "Insert into userinfo( name, email, phone, gender, address, work, DOB ) Values( $1, $2, $3, $4, $5, $6, $7 )";
  const values = [fullname, email, phone, gender, address, work,DOB]

  //Execute Query Now 

  try{
    pool.query(infoquery , values);
    console.log("user: " + fullname +" "+ "informations are stored in table ");
    res.redirect("userProfile.html")
  }

  catch(err){
    console.log("Error Storing Profile Data"+err);
  }
})



app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      console.log("Session.destroy");
      console.log("Logout Successfully");
      res.redirect("/Login");
    }
  });
});

// Starting Server
app.listen(3000, function (err) {
  if (err) throw err;
  console.log("Server Started");
});

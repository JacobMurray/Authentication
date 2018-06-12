var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    session         = require("express-session"),
    passport        = require("passport"),
    fbStrategy      = require("passport-facebook");
    
mongoose.connect("mongodb://localhost/authenticate3");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var app_id      = '1021551531325142',
    app_secret  = '21660837e9739dd5e3ac517b65dd54a2';


// SET MIDDLEWARE

app.use(session({
    secret: "Favourite instrument",
    resave: false,
    saveUninitialized: false,
}));

var fbOpts = {
    clientID: app_id,
    clientSecret: app_secret,
    callback: "https://webdevbootcamp-bansal321.c9users.io/auth/facebook/callback"
}


passport.use(new fbStrategy(fbOpts, function(accessToken, refreshToken, profile, cb){
    console.log(accessToken, refreshToken, profile);
}));



// ROUTE

app.get("/", passport.authenticate('facebook'));

app.get("/auth/facebook/callback", passport.authenticate('facebook', function(err, user, info){
    if (err) {
        console.log(err);
    } else {
        console.log(user, info);
    };
}));

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server has started")
})


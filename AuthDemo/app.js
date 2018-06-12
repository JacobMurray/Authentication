var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var app = express();
mongoose.connect("mongodb://localhost/authenticate2");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "Favourite instrument",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// ===================================
//              ROUTES
// ===================================
    
app.get("/", function(req, res){
    res.render("home");
})



app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
})


// REGISTER 

app.post("/", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if (err) {
           console.log(err);
           return res.render("home");
        }
           // TO USE FACEBOOK LOGIN - REPLACE LOCAL WITH FACEBOOK....
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");    
            });
    });
});


// LOG IN

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){});


// LOG OUT

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})



function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect("/login")
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
})
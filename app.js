var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")


// REQUIRE ALL THE ROUTES FOR DIFFERENT FUNCTIONS
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes      = require("./routes/index")


mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true}); //connect to a MongoDB database
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // then we don't need to add '.ejs' for 'landing'
app.use(express.static(__dirname + '/public')) // Ensure that the dirname will always be the directory where the script lives
app.use(methodOverride("_method"));
app.use(flash());
seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I want to have a cute ino dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); // have this middleware to move to next middle
});

// TO USE ALL THE ROUTES, and to have short route declaration for having the repeated route declaration in here
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT,process.env.IP, function(){
    console.log("YelpCamp Server has Started!");
})
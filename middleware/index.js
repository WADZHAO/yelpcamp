var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // check is the user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else{
                // check does the user matches the author?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to log in first");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // check is the user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else{
                // check does the user matches the author?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to log in first")
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login or Sign Up First"); 
    // Not flash the "Please Log..."  message right away, but store the value into the "error" key.
    // Show this before reirecting
    res.redirect("/login");
};


module.exports = middlewareObj;
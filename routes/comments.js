var express = require("express");
// new instance of express router in order to add all the routes to the router;
// Merge the id parameter from CAMPGRONUD with COMMENT ROUTES
var router  = express.Router({mergeParams: true}); 
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

// Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    // Find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});


// Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    // Look up comments using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.render("error", "Something went wrong");
        } else {
            // Create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    // add username and id to comments 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // console.log(comment.author.id);
                    // console.log(comment.author.username);
                    
                    // save comments
                    comment.save();
                    // Connect new comments to campground
                    campground.comments.push(comment);
                    campground.save();
                    // Redirect campground show page
                    req.flash("success", "Successfully added a comment")
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT the COMMENT
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});


// UPDATE the COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTORY the COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})



module.exports = router;
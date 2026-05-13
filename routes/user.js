const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

// router.route("/login")
// .get(userController.renderLoginForm)
// .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : '/login', failureFlash:true }) ,userController.login)

router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  (req, res, next) => {
    console.log("BEFORE PASSPORT"); // 👈 debug

    passport.authenticate("local", (err, user, info) => {
      console.log("PASSPORT CALLBACK"); // 👈 debug

      if (err) {
        console.log("ERROR:", err);
        return next(err);
      }

      if (!user) {
        console.log("NO USER:", info);
        return res.redirect("/login");
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        console.log("LOGIN SUCCESS"); // 👈 debug

        req.flash("success", "Welcome Back Wanderlust");

        let redirectUrl = res.locals.redirectUrl || "/listings";
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
  }
);

// signup
// router.get("/signup",userController.renderSignupForm);
// router.post("/signup", wrapAsync(userController.signup));
    
// login
// router.get("/login",userController.renderLoginForm);
// router.post("/login",  saveRedirectUrl, passport.authenticate("local", {failureRedirect : '/login', failureFlash:true }) ,userController.login);
    
router.get("/logout",userController.logout);
module.exports = router;
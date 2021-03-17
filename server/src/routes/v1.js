const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controller/users.controller");
const expenseController = require("../controller/expense.controller");

// Auth and Sign Up
router.post("/register", userController.register);
router.post("/auth", userController.login);
//------ Customize and protect Routes ------//
router.all("*", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("you are not authorized to access this area");
      error.status = 401;
      throw error;
    }
    req.user = user;
    return next();
  })(req, res, next);
});
//------ Protected Routes ------//

router.get("/expense", expenseController.get);
router.post("/expense", expenseController.create);
router.delete("/expense/:expense_id", expenseController.destroy);
router.put("/expense/:expense_id", expenseController.update);

module.exports = router;

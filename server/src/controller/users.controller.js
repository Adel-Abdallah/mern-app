const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const userController = {};

userController.register = async (req, res, next) => {
  const { name, email, password, joined } = req.body;
  const newUser = new User({
    name,
    email,
    password,
    joined
  });

  try {
    const user = await newUser.save();
    return res.send({ user });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoError") {
      let error = new Error(`Email address ${newUser.email} is alreday exist`);
      next(error);
    } else {
      next(e);
    }
  }
};
userController.login = async (req, res, next) => {
  //username,password in request
  const { email, password } = req.body;
  try {
    //check if username is ok
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error(`this email${email} not in our system`);
      err.status = 401;
      next(err);
    }
    //check if password is ok
    user.isPasswordMatch(password, user.password, (err, matched) => {
      if (matched) {
        //if credi OK,create JWT and return it
        const secret = process.env.JWT_SECRET;
        const expire = process.env.JWT_EXPIRAITION;

        const token = jwt.sign({ _id: user._id }, secret, {
          expiresIn: expire
        });
        return res.send({ token });
      }
      res.status(401).send({ error: "Invalid username/password combination" });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = userController;

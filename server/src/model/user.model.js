const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true },
  joined: { type: Date, default: new Date() }
});

UserSchema.pre("save", async function (next) {
  //Check new account Or password is modified
  if (!this.isModified("password")) {
    return next();
  }

  // Encrypt the password
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (e) {
    return next(e);
  }
});

UserSchema.methods.isPasswordMatch = function (password, hash, callback) {
  bcrypt.compare(password, hash, (err, success) => {
    if (err) {
      return callback(err);
    }
    callback(null, success);
  });
};
// to hide password from the user object
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

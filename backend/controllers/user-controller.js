const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User = require("../models/User");

//Register
module.exports.signup = async (req, res) => {
  try {
    const { fname, lname, email, password, passwordVerify } = req.body;

    //validation
    if (!fname || !lname || !email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({errorMessage: "Please enter a password of at least 6 characters."});
    }
    if (password !== passwordVerify) {
      return res
      .status(400)
      .json({errorMessage: "Please enter the same password."});
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
      .status(400)
      .json({errorMessage: "An account with this email already exists."});
    }

    //hash the passwod
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await User.create({
      fname,
      lname,
      email,
      passwordHash,
    });
    
    //sign token
    const token = jwt.sign(
      {
      user: newUser._id
      },
      process.env.JWT_SECRET
    );

    //send token -> HTTP-only cookie

    res.cookie("token", token, {
      httpOnly: true,
    })
    .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

//login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if ( !email || !password ) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res
        .status(401)
        .json({ errorMessage: "Wrong email or password!" });
    }

    const checkPassword = await bcrypt.compare(password, existingUser.passwordHash);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ errorMessage: "Wrong email or password!" });
    }

    //sign token
    const token = jwt.sign(
      {
      user: existingUser._id
      },
      process.env.JWT_SECRET
    );

    //send token -> HTTP-only cookie

    res.cookie("token", token, {
      httpOnly: true,
    })
    .send();
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
};

//logout
module.exports.logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  .send();
};

//auth
module.exports.checkUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }
    jwt.verify(token, process.env.JWT_SECRET);
    res.send(true);

  } catch(err) {
  console.error(err);
  res.json(false);
  }
};

//get user by ID
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};

//forgot password
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + existingUser.password;
  const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, {
    expiresIn: "5m",
  });
  const link = `http://localhost:5000/reset-password/${existingUser._id}/${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'orlice.triglav@gmail.com',
      pass: 'rhwoxqibewygowwx'
    },
  });

  var mailOptions = {
    from: "orlice.triglav@gmail.com",
    to: email,
    subject: "Password Reset ORLICE",
    text: link,
    html: `<h3><b>PASSWORD RESET</b></b></h3>
    <p>Klikni <a href=${link}>TUKAJ</a> za ponastavitev gesla.<br/></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log(link);
} catch (error) {}
};

//reset password
module.exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + existingUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

//new password
module.exports.updatePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + existingUser.password;
  try {
    const verify = jwt.verify(token, secret);

    //hash the passwod
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: passwordHash,
        },
      }
    );
    
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
};












const User = require("../model/user");
const jwt = require("jsonwebtoken");
const key = require("../keys/key");
const nodemailer = require("nodemailer");
var randomstring = require("randomstring");
const bcrypt = require("bcrypt");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: key.email,
    pass: key.pass,
    clientId: key.clientID,
    clientSecret: key.secretID,
    refreshToken: key.refreshToken,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

exports.register = (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const token = jwt.sign({ name, email, password }, key.jwtAccActivate, {
      expiresIn: "40min",
    });

    const randomCode = randomstring.generate(10);

    let mailOptions = {
      from: key.email,
      to: email,
      subject: "Account activation",
      html: `<h1>Email Activation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by adding this code after clicking on this link</p>
        <a href=http://localhost:8081/confirm/> Click here</a> 
        <p>${randomCode}</p>
        </div>`,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });

    let newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      status: false,
      code: randomCode,
    });
    newUser
      .save()
      .then(() => {
        console.log("Item saved in db");
        res.json({
          message: "Register success",
        });
      })
      .catch((err) => {
        console.log("Error in register: ", err);
        return res.status(400).json({ error: err });
      });
  });
};

exports.verify = (req, res) => {
  const { email } = req.body;
  const verfCode = req.b;
  User.findOne({ email }).exec((err, user) => {
    if (!user.status) {
      return res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    }
  });
};

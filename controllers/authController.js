// const firebase = require("firebase");
const firebase = require("../firebase-init.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { checkToken } = require("../middleware/auth.js");

exports.signup = (req, res) => {
  // Validate the input fields
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  // Check if user already exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) return res.status(500).json({ message: err.message });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });
  });

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // Store the user's data in MongoDB
      const newUser = new User({
        firebase_id: user.uid,
        email: email,
      });
      newUser.save((err) => {
        if (err) return res.status(500).json({ message: err.message });
        return res.status(201).json({ message: "User created successfully" });
      });
    })
    .catch((error) => {
      if(!res.headersSent) return res
        .status(500)
        .json({ error: error.code, message: error.message });
    });
};

exports.login = (req, res) => {
  // Validate the input fields
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCred) => {
      return userCred.user
        .getIdToken()
        .then((token) => {
          // check if user exists in our DB
          User.findOne({ firebase_id: userCred.user.uid }, (err, user) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!user)
              return res.status(404).json({ message: "User not found" });
            // create JWT
            jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
              if (err) return res.status(500).json({ message: err.message });
              return res.json({ token });
            });
          });
        })
        .catch((error) => {
          console.log(error);
          if(!res.headersSent) return res.status(401).json({ message: "Unauthorized" });
        });
    })
    .catch((error) => {
      console.log(error);
    if(!res.headersSent) return res.status(401).json({ message: error.message });
    });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      return res.status(200).json({ message: "Password reset email sent" });
    })
    .catch((error) => {
      if(!res.headersSent) return res
        .status(500)
        .json({ error: error.code, message: error.message });
    });
};


exports.getProfile = (req, res) => {
  // checkToken(req, res, () => {});
  let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];

  // Check if no token was provided
  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      // Remove Bearer from string
      const bearer = token.split(' ');
      const bearerToken = bearer[1];
      token = bearerToken;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
    }

  catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
  }
  firebase
    .auth()
    .getUser(req.user._id)
    .then((user) => {
      return res.staus(200).json(user);
    })
    .catch((error) => {
      if(!res.headersSent) return res.status(500).json({ message: error.message });
    });
};

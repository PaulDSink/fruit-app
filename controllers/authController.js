const express = require("express");
const router = express.Router();
const User = require("../models").User;
const bcrypt = require('bcryptjs');

require('dotenv').config()
const jwt = require('jsonwebtoken');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

// router.post('/', (req, res) => {
//     User.create(req.body).then((newUser) => {
//     res.redirect(`/users/profile/${newUser.id}`)
//     });
// });

// router.post("/", (req, res) => {
//     bcrypt.genSalt(10, (err, salt) => {
//       if (err) return res.status(500).json(err);
  
//       bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
//         if (err) return res.status(500).json(err);
//         req.body.password = hashedPwd;
  
//         User.create(req.body)
//           .then((newUser) => {
//             res.redirect(`/users/profile/${newUser.id}`);
//           })
//           .catch((err) => {
//             console.log(err);
//             res.send(`err ${err}`);
//           });
//       });
//     });
//   });

router.post("/", (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json(err);
  
      bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
        if (err) return res.status(500).json(err);
        req.body.password = hashedPwd;
  
        User.create(req.body)
          .then((newUser) => {
            const token = jwt.sign(
              {
                username: newUser.username,
                id: newUser.id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "30 days",
              }
            );
            console.log(token);
        res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
            res.redirect(`/users/profile/${newUser.id}`);
          })
          .catch((err) => {
            console.log(err);
            res.send(`err ${err}`);
          });
      });
    });
  });

router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        addAttempt: false,
    });
});

router.get('/login/addAttempt', (req, res) => {
    res.render('users/login.ejs', {
        addAttempt: true,
    });
});

// router.post('/login', (req, res) => {
//     User.findOne({
//         where: {
//             username: req.body.username,
//             password: req.body.password
//         },
//     }).then((user) => {
//         if(user == null) {
//             res.redirect('/auth/login/addAttempt');
//         } else {
//             console.log(user);
//             res.redirect(`/auth/profile/${user.id}`);
//         }
//     });
// });

// router.post("/login", (req, res) => {
//     User.findOne({
//       where: {
//         username: req.body.username,
//       },
//     }).then((foundUser) => {
//       if (foundUser) {
//         bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
//           if (match) {
//             res.redirect(`/users/profile/${foundUser.id}`);
//           } else {
//             return res.sendStatus(400);
//           }
//         });
//       }
//     });
//   });

router.post("/login", (req, res) => {
    User.findOne({
      where: {
        username: req.body.username,
      },
    }).then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
          if (match) {
            const token = jwt.sign(
              {
                username: foundUser.username,
                id: foundUser.id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "30 days",
              }
            );
            console.log(token);
        res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
            res.redirect(`/users/profile/${foundUser.id}`);
          } else {
            return res.sendStatus(400);
          }
        });
      }
    });
  });

module.exports = router;
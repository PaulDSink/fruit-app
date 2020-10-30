const express = require('express');
const router = express.Router();
// const users = require('../users');
const User = require('../models').User;
const Fruit = require('../models').Fruit;
const Season = require('../models').Season;

router.get('/', (req, res) => {
    res.render('users/index.ejs');
});


// router.get('/signup', (req, res) => {
//     res.render('users/signup.ejs');
// });

// router.post('/', (req, res) => {
//     users.push(req.body);
//     res.redirect(`/users/${users.length - 1}`);
// });

// router.post('/', (req, res) => {
//     User.create(req.body).then((newUser) => {
//     res.redirect(`/users/profile/${newUser.id}`)
//     });
// });

// router.get('/login', (req, res) => {
//     res.render('users/login.ejs', {
//         addAttempt: false,
//     });
// });

// router.get('/login/addAttempt', (req, res) => {
//     res.render('users/login.ejs', {
//         addAttempt: true,
//     });
// });

// router.post('/login', (req, res) => {
//     console.log(req.body);
//     users.forEach((user, index) => {
//         if(req.body.username === user.username && req.body.password === user.password) {
//             res.redirect(`/users/profile/${index}`);
//         } else if (index >= users.length - 1) {
//             // need code for displaying incorrect username or password
//             res.redirect('/users/login');
//         }
//     });
// });


//MOVED TO AUTH
// router.post('/login', (req, res) => {
//     User.findOne({
//         where: {
//             username: req.body.username,
//             password: req.body.password
//         },
//     }).then((user) => {
//         if(user == null) {
//             res.redirect('/users/login/addAttempt');
//         } else {
//             console.log(user);
//             res.redirect(`/users/profile/${user.id}`);
//         }
//     });
// });


// router.get('/profile/:index', (req, res) => {
//     res.render('users/profile.ejs', {
//         user: users[req.params.index],
//         index: req.params.index,
//     });
// });

// router.get('/profile/:id', (req, res) => {
//     User.findByPk(req.params.id,{
//         include: [
//             {
//                 model: Fruit,
//                 attributes: ['id', 'name']
//             }
//         ]
//     }).then((user) => {
//         res.render('users/profile.ejs', {
//             user: user,
//         });
//     });
// });

// GET USERS PROFILE
router.get("/profile/:id", (req, res) => {
    // IF USER ID FROM TOKEN MATCHES THE REQUESTED ENDPOINT, LET THEM IN
    if (req.user.id == req.params.id) {
      User.findByPk(req.params.id, {
        include: [
          {
            model: Fruit,
            attributes: ["id", "name"],
          },
        ],
      }).then((userProfile) => {
        res.render("users/profile.ejs", {
          user: userProfile,
        });
      });
    } else {
      // res.json("unauthorized");
      res.redirect("/");
    }
  });

router.put('/profile/:id', (req, res) => {
    User.update(req.body, {
        where: { id: req.params.id },
        returning: true
    }).then((user) => {
        res.redirect(`/users/profile/${req.params.id}`);
    });
});

// router.delete('/profile/:index', (req, res) => {
//     users.splice(req.params.index, 1);
//     res.redirect('/users');
// });

router.delete('/profile/:id', (req, res) => {
    User.destroy({
        where: { id: req.params.id }
    }).then(() => {
        res.redirect('/users');
    });
});

module.exports = router;
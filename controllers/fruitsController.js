const express = require('express');
const router = express.Router();
// const fruits = require('../fruits.js');
const Fruit = require('../models').Fruit;
const User = require('../models').User;
const Season = require('../models').Season;

// router.get('/', (req, res) => {
//     res.render('index.ejs', {
//         fruits: fruits
//     });
// });

router.get('/', (req, res) => {
    Fruit.findAll().then((fruits) => {
        res.render('index.ejs', {
            fruits: fruits,
        });
    });
});

router.get('/new', (req, res) => {
    res.render('new.ejs');
});

// router.post('/', (req, res) => {
//     if(req.body.readyToEat === 'on') {
//         req.body.readyToEat = true
//     } else {
//         req.body.readyToEat = false
//     }
//     fruits.push(req.body);
//     res.redirect('/fruits');
// });

router.post("/", (req, res) => {
    if (req.body.readyToEat === "on") {
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }

    Fruit.create(req.body).then((newFruit) => {
        res.redirect("/fruits");
    });
});

// router.get('/:index', (req, res) => {
//     res.render('show.ejs', {
//         fruit: fruits[req.params.index]
//     });
// });

router.get("/:id", (req, res) => {
    Fruit.findByPk(req.params.id,{
      include: [
        {
          model: User,
          attributes: ['name'],
        },{
          model: Season,
        }
      ],
    }).then((fruit) => {
      res.render("show.ejs", {
        fruit: fruit,
      });
    });
});

// router.delete('/:index', (req, res) => {
//     fruits.splice(req.params.index, 1);
//     res.redirect('/fruits');
// });

router.delete("/:id", (req, res) => {
    Fruit.destroy({ where: { id: req.params.id } }).then(() => {
      res.redirect("/fruits");
    });
});

// router.get('/:index/edit', function(req, res){
// 	res.render('edit.ejs', {
// 			fruit: fruits[req.params.index],
//             index: req.params.index
//     });
// });

// router.get("/:id/edit", function (req, res) {
//     Fruit.findByPk(req.params.id).then((fruit) => {
//       res.render("edit.ejs", {
//         fruit: fruit,
//       });
//     });
// });

router.get("/:id/edit", function (req, res) {
  Fruit.findByPk(req.params.id).then((foundFruit) => {
    Season.findAll().then((allSeasons) => {
      res.render("edit.ejs", {
        fruit: foundFruit,
        seasons: allSeasons,
      });
    });
  });
});

// router.put('/:index', (req, res) => {
//     if(req.body.readyToEat === 'on') {
//         req.body.readyToEat = true;
//     } else {
//         req.body.readyToEat = false;
//     }
//     fruits[req.params.index] = req.body;
//     res.redirect('/fruits');
// });

router.put("/:id", (req, res) => {
    if (req.body.readyToEat === "on") {
      req.body.readyToEat = true;
    } else {
      req.body.readyToEat = false;
    }
    Fruit.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    }).then((updatedFruit) => {
      Season.findByPk(req.body.season).then((foundSeason) => {
        Fruit.findByPk(req.params.id).then((foundFruit) => {
          foundFruit.addSeason(foundSeason);
          res.redirect('/fruits');
        });
      });
    });
});

module.exports = router;
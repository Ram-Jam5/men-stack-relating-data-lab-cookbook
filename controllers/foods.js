const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {    
        const currentUser = await User.findById(req.session.user._id);
        res.render('foods/index.ejs', {
            pantry: currentUser.pantry,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.get('/users', async (req, res) => {
    const allUsers = await User.find();
    console.log(allUsers)
    res.render('users/index.ejs', {
        user: allUsers,
    })
})

router.get('/users/:userId', async (req, res) => {
    const currentUser = await User.findById(req.params.userId);
    const food = currentUser.pantry
    res.render('users/show.ejs', {
        user: currentUser,
        pantry: food,
    })
});

router.get('/:foodId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const food = currentUser.pantry.id(req.params.foodId);
        res.render('foods/show.ejs', {
            pantry: food,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:foodId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const food = currentUser.pantry.id(req.params.foodId);
        res.render('foods/edit.ejs', {
            pantry: food,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});
router.put('/:foodId', async (req, res) => {    
    try {
        const currentUser = await User.findById(req.session.user._id);
        const food = currentUser.pantry.id(req.params.foodId);
        food.set(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods/${req.params.foodId}`
        );
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.delete('/:foodId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.pantry.id(req.params.foodId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods`)
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

router.get('/new', async (req, res) => {
    try {
        res.render('foods/new.ejs');
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});


router.post('/',async (req, res) => {
    console.log(req.body)
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.pantry.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

module.exports = router;



// Index	‘/users/:userId/foods’	GET !
// New	‘/users/:userId/foods/new’	GET !
// Create	‘/users/:userId/foods’	POST !
// Show	‘/users/:userId/foods/:itemId’	GET !
// Edit	‘/users/:userId/foods/:itemId/edit’	GET !
// Update	‘/users/:userId/foods/:itemId’	PUT !
// Delete	‘/users/:userId/foods/:itemId’	DELETE !
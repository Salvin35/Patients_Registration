const router = require('express').Router();
let User = require('./user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const dob = Date.parse(req.body.dob);

    const newUser = new User({
        firstName,
        lastName,
        gender,
        dob,
    });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Delete a user
router.route('/:id').delete((req, res) => {
    console.log("reached");
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Update a user
router.route('/:id').put(async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            req.body,
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json('Error updating user');
    }
});

module.exports = router;

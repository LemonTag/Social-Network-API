const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt'); // To hash passwords
const { Op } = require('sequelize');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create a new user in the database with the provided username, email, and hashed password
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user's session
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user_id = newUser.id;
      req.session.username = newUser.username;

      // Send back the newly created user data
      res.status(201).json(newUser);
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json(error);
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    // Find the user in the database by email
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // If the user is not found, send a 400 status code with a message
    if (!user) {
      res.status(400).json({ message: 'No user found with this email address!' });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    // If the password is invalid, send a 400 status code with a message
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    // Save the user's session
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user_id = user.id;
      req.session.username = user.username;

      // Send back the user data and a success message
      res.status(200).json({ user: user, message: 'You are now logged in!' });
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json(error);
  }
});

// Logout a user
router.post('/logout', (req, res) => {
  // If the user is logged in, destroy the session
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end(); 
    });
  } else {
    res.status(404).end(); // Send a 404 status code indicating not found
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    // Find the user in the database by ID, excluding the password field
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: { exclude: ['password'] },
    });

    // If the user is not found, send a 404 status code with a message
    if (!user) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    // Send back the user data
    res.status(200).json(user);
  } catch (error) {
    console.error(error); 
    res.status(500).json(error);
  }
});

// Update user profile by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedData = req.body;

    // If a new password is provided, hash it before saving
    if (req.body.password) {
      updatedData.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user data in the database by ID
    const [updated] = await User.update(updatedData, {
      where: {
        id: req.params.id,
      },
    });

    // If no rows were updated, send a 404 status code with a message
    if (!updated) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    // Find the updated user data and exclude the password field
    const updatedUser = await User.findOne({ where: { id: req.params.id }, attributes: { exclude: ['password'] } });

    // Send back the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error); 
    res.status(500).json(error);
  }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete the user from the database by ID
    const deleted = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    // If no rows were deleted, send a 404 status code with a message
    if (!deleted) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    // Send back the number of rows affected
    res.status(200).json(deleted);
  } catch (error) {
    console.error(error); 
    res.status(500).json(error);
  }
});

module.exports = router;

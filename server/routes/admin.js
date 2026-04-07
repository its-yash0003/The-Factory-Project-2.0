const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Admin routes mount point
// All routes under /api/admin require authentication

router.get('/', auth, (req, res) => {
  res.json({ message: 'Admin access granted', user: req.user });
});

module.exports = router;

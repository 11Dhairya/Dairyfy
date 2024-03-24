const express = require('express');
const router = express.Router();

const controller = require('../controllers');

router.get('/test', (req, res) => {
  console.log("works");
  return res.status(200);
});

module.exports = router;
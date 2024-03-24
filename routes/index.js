const express = require('express');

const musicRouter = require('../music/routes');
const userRouter = require('../user/routes');
const socketRouter = require('../socket-server/routes');

const router = express.Router();

router.use(socketRouter);
router.use(musicRouter);
router.use(userRouter);


module.exports = router;
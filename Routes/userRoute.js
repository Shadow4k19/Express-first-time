const express = require('express');
const {getUser, Postuser, Putuser, Deleteuser, GetUserbyUsername} = require('../controller/user_cotroller');
const router = express.Router();

router.get('/user', getUser);
router.get('/user/:username', GetUserbyUsername);
router.post('/user', Postuser);
router.put('/user', Putuser);
router.delete('/user', Deleteuser);

module.exports = router;
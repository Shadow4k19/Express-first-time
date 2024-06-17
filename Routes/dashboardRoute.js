const express = require('express');
const {GetDashboard} = require('../controller/dashboardcontroller');
const router = express.Router();

router.get('/dashboard/:username', GetDashboard);

module.exports = router;
const express = require('express');
const {GetDashboard} = require('../controller/dashboardcontroller');
const router = express.Router();

router.get('/dashboard', GetDashboard);

module.exports = router;
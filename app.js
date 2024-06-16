const express = require('express');
const bodyParser = require('body-parser');
const corsConfig = require('./Cors/Corsconfig');
const authRoutes = require('./Routes/authRoute');
const userRoutes = require('./Routes/userRoute');
const dashboardRoutes = require('./Routes/dashboardRoute');
const slideshow = require('./Routes/slideshowRoute');

const app = express();

app.use(bodyParser.json());
app.use(corsConfig);

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', dashboardRoutes);
app.use('api', slideshow);

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const corsConfig = require('./Cors/Corsconfig');
const authRoutes = require('./Routes/authRoute');
const userRoutes = require('./Routes/userRoute');
const dashboardRoutes = require('./Routes/dashboardRoute');
const slideshow = require('./Routes/slideshowRoute');
const content = require('./Routes/ContentRoute');
const app = express();

app.use(bodyParser.json());
app.use(corsConfig);

app.use('/authapi', authRoutes);
app.use('/userapi', userRoutes);
app.use('/dashboardapi', dashboardRoutes);
app.use('/slideshowapi', slideshow);
app.use('/contentapi', content);

module.exports = app;
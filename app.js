const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const corsConfig = require('./Cors/Corsconfig');
const authRoutes = require('./Routes/authRoute');
const userRoutes = require('./Routes/userRoute');
const dashboardRoutes = require('./Routes/dashboardRoute');
const slideshow = require('./Routes/slideshowRoute');
const content = require('./Routes/ContentRoute');

const app = express();

app.use(bodyParser.json());
app.use(corsConfig);

app.use('/IMG_CONTENT', express.static(path.join(__dirname, 'IMG_CONTENT')));
app.use('/IMG_SLIDESHOW', express.static(path.join(__dirname, 'IMG_SLIDESHOW')));
app.use('/authapi', authRoutes);
app.use('/userapi', userRoutes);
app.use('/dashboardapi', dashboardRoutes);
app.use('/slideshowapi', slideshow);
app.use('/contentapi', content);

module.exports = app;
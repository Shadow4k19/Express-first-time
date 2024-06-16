const cors = require('cors');

/*Cor Header setting*/ 
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin']
};

module.exports = cors(corsOptions);
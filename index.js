const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

/*Get All data in file .env*/
dotenv.config();

/*get request data in Json */
app.use(bodyParser.json());

/*Cor Header setting*/ 
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin']
}));

/*DB Connection */
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

/*DB Connection*/ 
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
});

/*Register API*/ 
app.post('/register', (req,res)=>{
    const { username , password, Feburary, March, April } = req.body;

    if(!username || !password || !Feburary || !March || !April){
        return JSON.stringify({
            status: 400,
            message: "all detail require",
        });
    }
    try{
        const [existUser] = db.execute("SELECT * FROM user WHERE username = ?",[username]);
        if(existUser.length > 0){
            return JSON.stringify({
                status: 400,
                message: "Username already exist",
            });
        }
        const role = "user";
        const [result1] = db.execute("INSERT INTO user (usename, password,role) VALUES (?,?,?)",[username,password,role]);
        const [result2] = db.execute("INSERT INTO dashdboard (Feburary,March,April) VALUES (?,?,?)",[Feburary,March,April])

        return JSON.stringify({
            status: 201,
            message: "Create complete",
        });
    }catch(e){
        console.log(e);
        return JSON.stringify({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
/*End of Register API*/

/*Login API*/
app.post('/login',(req,res)=>{
    const { username, password } = req.body;

    if(username && password){
        const query = 'SELECT * FROM user WHERE username = ? AND PASSWORD = ?';
        db.execute(query, [username,password], (err,result)=>{
            if(err){
                return JSON.stringify({
                    status: 500,
                    message: "Error querying database",
                });
            }

            if(result.length !== 0){
                return JSON.stringify({
                    status: 401,
                    message: "Invalid credentials",
                });
            }

            return JSON.stringify({
                status: 200,
                message: 'Login Successfuly',
            });
        });
    }else{
        return JSON.stringify({
            status: 400,
            message: "Not have a data",
        });
    }
});
/*End of Login API */

/*Dashboard API */
app.get('/dashboard',(req,res) =>{
    const username = req.query.username;

    if(!username){
        return JSON.stringify({
            status: 400,
            message: "Username Require",
        });
    }

    try{
        const [data] = db.execute("SELECT * FROM dashboard WHERE username = ?",[username]);
        if(data){
            return JSON.stringify({
                status: 200,
                data: data,
                message: "Get data Successfuly",
            });
        }else{
            return JSON.stringify({
                status: 404,
                message: "Data Not Found",
            })
        }
    }catch(e){
        console.log(e);
        return JSON.stringify({
            status: 500,
            message: "Internal Server Error",
        })
    }
});
/*End of Dashboard API*/

/*User API*/
/*user get*/
app.get('/user', (req,res) =>{
    const username = req.query.username;
    if(username){
        const [user] = db.execute("SELECT * FROM user WHERE username = ?", [username]);
        const [dashboard] = db.execute("SELECT * FROM dashboard WHERE username = ?",[username]);

        if(user && dashboard){
            return JSON.stringify({
                status: 200,
                data: {user : user , dashboard : dashboard},
            })
        }else{
            return JSON.stringify({
                status: 404,
                message : "Data not Found",
            })
        }
    }
});
/*user post*/
app.post('/user',(req,res)=>{
    const { username , password, Feburary, March, April } = req.body;

    if(!username || !password || !Feburary || !March || !April){
        return JSON.stringify({
            status: 400,
            message: "all detail require",
        });
    }
    try{
        const [existUser] = db.execute("SELECT * FROM user WHERE username = ?",[username]);
        if(existUser.length > 0){
            return JSON.stringify({
                status: 400,
                message: "Username already exist",
            });
        }
        const role = "user";
        const [result1] = db.execute("INSERT INTO user (usename, password,role) VALUES (?,?,?)",[username,password,role]);
        const [result2] = db.execute("INSERT INTO dashdboard (Feburary,March,April) VALUES (?,?,?)",[Feburary,March,April])

        return JSON.stringify({
            status: 201,
            message: "Create complete",
        });
    }catch(e){
        console.log(e);
        return JSON.stringify({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
/*user put*/
app.put('/user',(req, res) => {
    const { id, username, password, role, February, March, April } = req.body;
    
    if (!id || !username || !password || !role || !February || !March || !April) {
        return JSON.stringify({
            status: 400,
            message: "Pls fill all data",
        });
    }

    try {
        const [exist] = db.execute("SELECT * FROM user WHERE id = ?", [id]);

        if (exist.length === 0) {
            return JSON.stringify({
                status: 404,
                message: "User not found",
            });
        }

        db.execute("UPDATE user SET username = ?, password = ?, role = ? WHERE id = ?", [username, password, role, id]);
        db.execute("UPDATE dashboard SET username = ?, February = ?, March = ?, April = ? WHERE id = ?", [username, February, March, April, id]);
        return JSON.stringify({
            status: 200,
            message: "Update Complete",
        });
    } catch (error) {
        return JSON.stringify({
            status: 500,
            message: "Internal Server Error",
        });
    }
});
/*user delete*/
app.delete('/user',(req,res) =>{
    const {id} = req.body;
    try{
    if(!id){
        return JSON.stringify({
            status: 400,
            message: "Pls fill a ID",
        });
    }

    const [exist] = db.execute("SELECT * FROM user WHERE id = ?",[id]);

    if(exist.length > 0){
        db.execute("DELETE FROM user WHERE id = ?",[id]);
        db.execute("DELETE FROM dashboard WHERE id = ?",[id]);

        return JSON.stringify({
            status: 200,
            message: "Delete Complete",
        });
    }else{
        return JSON.stringify({
            status: 404,
            message: "404 Not found",
        });
    }}catch(e){
        console.log(e);
    }
});
/*End of User API*/

app.listen(8080,()=>{
    console.log("Server is running in port 8080");
});
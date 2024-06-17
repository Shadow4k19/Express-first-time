const db = require('../config/db');

/*Register Controller*/ 
exports.register = async (req, res) => {
    const { username , password, Feburary, March, April } = req.body;

    if(!username || !password || !Feburary || !March || !April){
        return res.json({
            status: 400,
            message: "all details are require",
        });
    }
    try{
        const [existUser] =  await db.promise().execute("SELECT * FROM user WHERE username = ?",[username]);
        if(existUser.length > 0){
            res.json({
                status: 400,
                message: "Username already exist",
            });
        }
        const role = "user";
        const [result1] = await db.promise().execute("INSERT INTO user (usename, password,role) VALUES (?,?,?)",[username,password,role]);
        const [result2] = await db.promise().execute("INSERT INTO dashdboard (Feburary,March,April) VALUES (?,?,?)",[Feburary,March,April])

        res.json({
            status: 201,
            message: "Create complete",
        });
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};
/*End of Register Controller*/


/*Login controllers*/
exports.login = async (req,res)=>{
    const { username, password } = req.body;

    if(username && password){
        const query = 'SELECT * FROM user WHERE username = ? AND PASSWORD = ?';
        db.promise().execute(query, [username,password], (err,result)=>{
            if(err){
                res.json({
                    status: 500,
                    message: "Error querying database",
                });
            }

            if(result.length !== 0){
                res.json({
                    status: 401,
                    message: "Invalid credentials",
                });
            }

            res.json({
                status: 200,
                message: 'Login Successfuly',
            });
        });
    }else{
        res.json({
            status: 400,
            message: "Not have a data",
        });
    }
};
/*End of Login controllers */





const db = require("../config/db");

/*User Controller*/
/*user get*/
exports.getUser = async (req,res) =>{
    try{
        const [user] = await db.promise().execute("SELECT * FROM user");
        const [dashboard] = await db.promise().execute("SELECT * FROM dashboard");

        if(user && dashboard){
            return res.json({
                status: 200,
                data: {user: user, dashboard : dashboard},
            });
        }else{
            return res.json({
                status: 404,
                message : "Data not Found",
            });
        }
    }catch(e){
        console.log(e);
        return res.json({
            message : e.message,
            status: 400,
        });
    }
};

exports.GetUserbyUsername = async (req, res) =>{
    const username = req.params.username;
    
    try{
        if(username){
            const [user] = await db.promise().execute("SELECT * FROM user WHERE username = ?",[username]);
            const [dashboard] = await db.promise().execute("SELECT * FROM dashboard WHERE username = ?",[username]);

            if(user && dashboard){
                res.json({
                    status: 200,
                    data: {user: user, dashboard : dashboard},
                });
            }else{
                res.json({
                    status: 404,
                    message : "Data not Found",
                });
            }
        }else{
            res.json({
                message : "username require",
                status  : 400,
            });
        }
    }catch(e){
        console.log(e);
        res.json({
            message : e.message,
            status: 400,
        });
    }
    
};
/*user post*/
exports.Postuser = async (req,res)=>{
    const { username , password, Feburary, March, April } = req.body;

    if(!username || !password || !Feburary || !March || !April){
        return res.json({
            status: 400,
            message: "all detail require",
        });
    }
    try{
        const [existUser] = await db.promise().execute("SELECT * FROM user WHERE username = ?",[username]);
        if(existUser.length > 0){
            return res.json({
                status: 400,
                message: "Username already exist",
            });
        }
        const role = "user";
        const [result1] = await db.promise().execute("INSERT INTO user (username, password,role) VALUES (?,?,?)",[username,password,role]);
        const [result2] = await db.promise().execute("INSERT INTO dashboard (username,Feburary,March,April) VALUES (?,?,?,?)",[username,Feburary,March,April])

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
/*user put*/
exports.Putuser = async (req, res) => {
    const { id, username, password, role, February, March, April } = req.body;
    
    if (!id || !username || !password || !role || !February || !March || !April) {
        return res.json({
            status: 400,
            message: "Pls fill all data",
        });
    }

    try {
        const [exist] = await db.promise().execute("SELECT * FROM user WHERE id = ?", [id]);

        if (exist.length === 0) {
            return res.json({
                status: 404,
                message: "User not found",
            });
        }

        await db.promise().execute("UPDATE user SET username = ?, password = ?, role = ? WHERE id = ?", [username, password, role, id]);
        await db.promise().execute("UPDATE dashboard SET username = ?, February = ?, March = ?, April = ? WHERE id = ?", [username, February, March, April, id]);
        res.json({
            status: 200,
            message: "Update Complete",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};
/*user delete*/
exports.Deleteuser = async (req,res) =>{
    const {id} = req.body;
    try{
    if(!id){
        res.json({
            status: 400,
            message: "Pls fill a ID",
        });
    }

    const [exist] = await db.promise().execute("SELECT * FROM user WHERE id = ?",[id]);

    if(exist.length > 0){
        db.execute("DELETE FROM user WHERE id = ?",[id]);
        db.execute("DELETE FROM dashboard WHERE id = ?",[id]);

        res.json({
            status: 200,
            message: "Delete Complete",
        });
    }else{
        res.json({
            status: 404,
            message: "404 Not found",
        });
    }}catch(e){
        console.log(e);
    }
};
/*End of User Controller*/
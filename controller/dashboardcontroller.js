const db = require('../config/db');

/*Dashboard Controller*/
exports.GetDashboard = async (req,res) =>{
    const username = req.query.username;

    if(!username){
        return JSON.stringify({
            status: 400,
            message: "Username Require",
        });
    }

    try{
        const [data] = await db.promise().execute("SELECT * FROM dashboard WHERE username = ?",[username]);
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
};
/*End of Dashboard Controller*/
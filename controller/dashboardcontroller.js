const db = require('../config/db');

/*Dashboard Controller*/
exports.GetDashboard = async (req,res) =>{
    const username = req.params.username;

    if(!username){
        return res.json({
            status: 400,
            message: "Username Require",
        });
    }

    try{
        const [data] = await db.promise().execute("SELECT * FROM dashboard WHERE username = ?",[username]);
        if(data){
            res.json({
                status: 200,
                data: data,
                message: "Get data Successfuly",
            });
        }else{
            res.json({
                status: 404,
                message: "Data Not Found",
            })
        }
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            message: "Internal Server Error",
        })
    }
};
/*End of Dashboard Controller*/
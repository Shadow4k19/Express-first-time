const db = require('../config/db');
const fs = require('fs');

/* Content Controller */
/*GET Content*/
exports.getContent = async (req, res) =>{
    try{
        const [row] = await db.promise().execute("SELECT * FROM content");
        if(row){
            return res.json({
                message : "Successfuly",
                data : row,
                status : 200,
            });
        }else{
            return res.json({
                message : "Failed to get data",
                status : 500,
            });
        }
    }catch(e){
        console.log(e);
        return res.json({
            message : e.message,
            status : 500,
        })
    }
}
/*GET BY ID*/
exports.getContentByID = async (req, res) =>{
    try{
    const id = req.params.id;
    if(id){
        const [row] = await db.promise().execute("SELECT * FROM content WHERE id = ?",[id]);

        if(row){
            return res.json({
                message : "Successfuly",
                data : row,
                status : 200,
            });
        }else{
            return res.json({
                message : "Failed to get data",
                status : 500,
            });
        }
    }else{
        return res.json({
            message : "ID requrie",
            status : 400,
        });
    }
    }catch(e){
        console.log(e);
        res.json({
            message : e.message,
            status : 500,
        });
    }
}
/*END OF GET CONTENT*/
/*Post Content*/
exports.PostContent = async (req, res) =>{
    const { title, content } = req.body;
    if(!title || !req.file || !content){
        return res.json({
            message : "All data require",
            status : 400,
        });
    }
    const targetFile = req.file.path;

    try {
        const sql = "INSERT INTO content (title, img, content) VALUES (?, ?, ?)";
        const [result] = await db.promise().execute(sql, [title, targetFile, content]);
        
        return res.json({ 
            message: "Create successfully",
            status: 201 
        });
    } catch (e) {
        console.log(e);
        return res.json({
            message: e.message
        });
    }

}
/*END OF POST CONTENT*/

/*PUT CONTENT*/
exports.PutContent = async (req, res) =>{
    const { id, title, content, img } = req.body;
        if (!id || !title || !content) {
            return res.json({ 
                message: "Please fill in all details", 
                status : 400,
            });
        }

        let targetFile = null;

        const [rows] = await db.promise().execute("SELECT * FROM content WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.json({
                message: "Record not found",
                status: 404,
            });
        }

        if (img) {
            const oldImgPath = rows[0].img;
            if (oldImgPath && fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }
    
            const base64Data = img.replace(/^data:image\/(jpeg|jpg|png);base64,/, '');
            const imgBuffer = Buffer.from(base64Data, 'base64');
    
            const targetDir = 'IMG_CONTENT';
            const imgPath = `${targetDir}/content_${id}.jpg`;
    
            fs.writeFileSync(imgPath, imgBuffer);
    
            targetFile = imgPath;
    
            return res.json({
                message: "Update Complete",
                status: 200,
            });
        }
        try {
            const sql = `UPDATE content SET title = ?, content = ?${targetFile ? ", img = ?" : ""} WHERE id = ?`;
            const params = targetFile ? [title, content, targetFile, id] : [title, content, id];
            await db.promise().execute(sql, params);

            return res.json({ 
                message : "Update successful", 
                status : 200, 
            });
        } catch (e) {
            console.error(e);
            res.json({ 
                message: e.message,
                status : 500,
            });
        }
    };
/*END PUT CONTENT*/

/*DELETE CONTENT*/
exports.DeleteContent = async (req, res) =>{
    const { id } = req.body;
    try{
        if(!id){
            return res.json({
                message : "ID require",
                status : 400,
            });
        }

        const sql = "SELECT * FROM content WHERE id = ?";
        const [rows] = await db.promise().execute(sql, [id]);
        if(rows.length === 0){
            return res.json({
                message : "Not Found",
                status : 404,
            });
        };

        
        if (rows.img && fs.existsSync(path.join(__dirname, '..', rows.img))) {
            fs.unlinkSync(path.join(__dirname, '..', rows.img));
        }

        await db.promise().execute("DELETE FROM content WHERE id = ?",[id]);
        return res.json({
            message : 'DELETE COMPLETE',
            status : 200,
        });

    }catch(e){
        console.log(e);
        return res.json({
            message : e.message,
            status : 200,
        });
    }
}
/*END OF DELETE CONTENT*/
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.getSlideshows = async (req, res) => {
    try {
        const [rows] = await db.promise().execute('SELECT * FROM slideshow');
        res.json({
            message: "Successfuly",
            data: rows,
            status: 200,
        });
    } catch (error) {
        res.json({
            message: error.message,
            status: 500,
        });
    }
};

exports.getSlideshowById = async (req, res) => {
    try {
        if(!req.params.id){
            return res.json({
                message : "ID require",
                status: 400,
            });
        }
        const [rows] = await db.promise().execute('SELECT * FROM slideshow WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            return res.json({
                message: "Successfully",
                data: rows,
                status: 200,
            });
        } else {
            return res.json({
                message: "Not Found",
                status: 404,
            });
        }
    } catch (error) {
        res.json({
            message: error.message,
            status: 500,
        });
    }
};

exports.PostSlideshow = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                message: 'PLS fill all details',
                status: 400,
            });
        }

        const url = `/IMG_SLIDESHOW/${req.file.filename}`;
        await db.promise().execute('INSERT INTO slideshow (url) VALUES (?)', [url]);
        res.json({
            message : 'Create Complete',
            status: 201,
        });
    } catch (error) {
        res.json({
            message: error.message,
            status: 500,
        });
    }
};

exports.PutSlideshow = async (req, res) => {
    const { id, url } = req.body;
    if (!id || !url) {
        return res.json({
            message: "Please fill all details",
            status: 400,
        });
    }

    try {
        const [rows] = await db.promise().execute("SELECT url FROM slideshow WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.json({
                message: "Record not found",
                status: 404,
            });
        }

        const oldImgPath = rows[0].url;
        if (oldImgPath && fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);
        }

        const base64Data = url.replace(/^data:image\/(jpeg|jpg|png);base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');

        const targetDir = 'IMG_SLIDESHOW';
        const imgPath = `${targetDir}/slideshow_${id}.jpg`;

        fs.writeFileSync(imgPath, imgBuffer);

        const sql = "UPDATE slideshow SET url = ? WHERE id = ?";
        await db.promise().execute(sql, [imgPath, id]);

        return res.json({
            message: "Update Complete",
            status: 200,
        });
    } catch (e) {
        console.error(e);
        res.json({
            message: e.message,
            status: 500,
        });
    }
};

exports.deleteSlideshow = async (req, res) => {
    try {
        const { id } = req.body;
        if(!id){
            return res.json({
                message : "ID require", 
                status: 400,
            });
        }
        const [[row]] = await db.promise().execute('SELECT * FROM slideshow WHERE id = ?', [id]);
        if (!row) {
            return res.json({
                message: "Not Found",
                status: 404,
            });
        }

        if (row.url && fs.existsSync(path.join(__dirname, '..', row.url))) {
            console.log("DO");
            fs.unlinkSync(path.join(__dirname, '..', row.url));
        }

        await db.promise().execute('DELETE FROM slideshow WHERE id = ?', [id]);
        return res.json({
            message: 'DELETE Complete',
            status: 200,
        });
    } catch (error) {
        res.json({
            message: error.message,
            status: 500,
        });
    }
};

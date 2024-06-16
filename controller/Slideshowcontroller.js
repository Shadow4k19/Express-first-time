// controllers/slideshowController.js
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.getSlideshows = async (req, res) => {
    try {
        const [rows] = await db.promise().execute('SELECT * FROM slideshow');
        return JSON.stringify({
            message: "Successfuly",
            data: rows,
            status: 200,
        });
    } catch (error) {
        return JSON.stringify({
            message: error.message,
            status: 500,
        });
    }
};

exports.getSlideshowById = async (req, res) => {
    try {
        const [rows] = await db.promise().execute('SELECT * FROM slideshow WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.status(200).json({ message: 'Successfully', data: rows, status: 200 });
            return JSON.stringify({
                message: "Successfully",
                data: rows,
                status: 200,
            });
        } else {
            return JSON.stringify({
                message: "Not Found",
                status: 404,
            });
        }
    } catch (error) {
        return JSON.stringify({
            message: error.message,
            status: 500,
        });
    }
};

exports.PostSlideshow = async (req, res) => {
    try {
        if (!req.file) {
            return JSON.stringify({
                message: 'PLS fill all details',
                status: 400,
            });
        }

        const url = `/IMG_SLIDESHOW/${req.file.filename}`;
        await db.promise().execute('INSERT INTO slideshow (url) VALUES (?)', [url]);
        return JSON.stringify({
            message : 'Create Complete',
            status: 201,
        });
    } catch (error) {
        return JSON.stringify({
            message: error.message,
            status: 500,
        });
    }
};

exports.PutSlideshow = async (req, res) => {
    /*try {
        const { id } = req.body;
        const targetFile = req.file ? `/IMG_SLIDESHOW/${req.file.filename}` : null;

        const [[row]] = await db.promise().execute('SELECT * FROM slideshow WHERE id = ?', [id]);
        if (!row) {
            return JSON.stringify({
                message: 'Not Found',
                status: 404,
            });
        }

        if (targetFile) {
            if (row.img && fs.existsSync(path.join(__dirname, '..', row.img))) {
                fs.unlinkSync(path.join(__dirname, '..', row.img));
            }
            await db.promise().execute('UPDATE content SET title = ?, content = ?, img = ? WHERE id = ?', [title, content, targetFile, id]);
        } else {
            await db.promise().execute('UPDATE content SET title = ?, content = ? WHERE id = ?', [title, content, id]);
        }

        res.status(200).json({ message: 'Update Complete', status: 200 });
    } catch (error) {
        res.status(500).json({ message: error.message, status: 500 });
    }*/
};

exports.deleteSlideshow = async (req, res) => {
    try {
        const { id } = req.body;

        const [[row]] = await db.promise().execute('SELECT * FROM slideshow WHERE id = ?', [id]);
        if (!row) {
            return JSON.stringify({
                message: "Not Found",
                status: 404,
            });
        }

        if (row.url && fs.existsSync(path.join(__dirname, '..', row.url))) {
            fs.unlinkSync(path.join(__dirname, '..', row.url));
        }

        await db.promise().execute('DELETE FROM slideshow WHERE id = ?', [id]);
        return JSON.stringify({
            message: 'DELETE Complete',
            status: 200,
        });
    } catch (error) {
        return JSON.stringify({
            message: error.message,
            status: 500,
        });
    }
};

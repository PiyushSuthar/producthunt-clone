const multer = require('multer')
const fs = require('fs')

/**
 * 
 * @param {String} str 
 * @returns ex. foo bar to foo-bar 
 */
exports.parseText = str => str.toString().replace(/\s+/g, '-').toLowerCase()
const parseText = this.parseText

// Image store
exports.ImageStore = multer.diskStorage({
    destination: function (req, file, callback) {
        const developerName = parseText(req.user.username);
        const appName = parseText(req.body.name)
        const devDir = `uploads/${developerName}`;
        const fullDir = `uploads/${developerName}/${appName}`
        if (fs.existsSync(fullDir)) {
            return callback(null, fullDir);
        } else {
            if (fs.existsSync(devDir)) {
                return fs.mkdir(fullDir, (error) => callback(error, fullDir))
            } else {
                return fs.mkdir(devDir, () => {
                    fs.mkdir(fullDir, (error) => callback(error, fullDir))
                });
            }
        }
    },
    filename: function (req, file, callback) {
        const fileName = parseText(file.originalname)
        callback(null, Date.now() + "-"+ parseText(req.body.name) + fileName);
    },
});

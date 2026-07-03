const multer = require('multer');            //files ko handle karne ke liye multer ka use karte hai

const upload = multer({
    storage: multer.memoryStorage(),          //ye memoryStorage ka use karte hai taki file ko memory me store kare
    limits: {
        fileSize: 5 * 1024 * 1024,          //file size limit 5MB rakha hai
    }
})

module.exports = upload
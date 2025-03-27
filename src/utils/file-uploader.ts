import multer from "multer";
import path from "path";
import uuid from "uuid";


const uploader = (folder) => {
    const storage = multer.diskStorage({
        destination: path.join(__dirname, 'public', 'uploads', folder),
        filename(req, file, callback) {
            callback(null, uuid.v4() + path.extname(file.originalname) )
        },
        
    })
    return multer({
        storage,
        fileFilter(req, file, callback: any) {
            const allowedFiles = /jpg|jpeg|png|gif|bmp|tiff|tif|webp|heif|heic|svg/i;
            const mimetype = allowedFiles.test(file.mimetype)
            const isFileAllowed = allowedFiles.test(file.originalname)

            if(mimetype && isFileAllowed) {
                return callback(null, true)
            }
            callback(new Error("File is not supported"), false)
            
        },
    })
}

export {uploader}

const multer = require("multer")
const multerS3 = require("multer-s3")
const s3 = require("./s3")

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      const key =
        req.originalUrl === "/images"
          ? file.originalname
          : `temp-${file.originalname}`
      cb(null, key)
    },
  }),
})

module.exports = upload

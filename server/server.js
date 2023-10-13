require("dotenv").config()
const ibm = require("ibm-cos-sdk")
const express = require("express")
const multer = require("multer")
const multerS3 = require("multer-s3")

const app = express()
const s3 = new ibm.S3({
  endpoint: process.env.ENDPOINT,
  apiKeyId: process.env.API_KEY_ID,
  serviceInstanceId: process.env.SERVICE_INSTANCE_ID,
  credentials: new ibm.Credentials(
    process.env.ACCESS_KEY,
    process.env.SECRET_ACCESS_KEY,
    (sessionToken = null)
  ),
  signatureVersion: "v4",
})
const PORT = 3000
const BUCKET_NAME = "clothing-images"

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      console.log(file)
      cb(null, file.originalname)
    },
  }),
})

app.post("/images/upload", upload.single("image"), (req, res) => {
  if (res.statusCode === 200) {
    console.log("Uploaded image successfully")
  } else {
    console.log("Upload failed")
  }
})

app.get("/images", async (req, res) => {
  const imageUrlList = []
  try {
    const data = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise()
    if (data) {
      const urlPromises = data.Contents.map((bucketContent) => {
        return new Promise((resolve, reject) => {
          const urlParams = { Bucket: BUCKET_NAME, Key: bucketContent.Key }
          s3.getSignedUrl("getObject", urlParams, (err, url) => {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              imageUrlList.push(url)
              resolve(url)
            }
          })
        })
      })

      await Promise.all(urlPromises)
    }
  } catch (e) {
    console.log(e)
  }

  res.json({ urls: imageUrlList })
})

app.listen(PORT, () => {
  console.log(`Server started. Listening on Port ${PORT}`)
})

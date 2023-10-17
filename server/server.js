require("dotenv").config()
const ibm = require("ibm-cos-sdk")
const express = require("express")
const cors = require("cors")
const multer = require("multer")
const multerS3 = require("multer-s3")
const mongoose = require("mongoose")
const Item = require("./models/Item")

mongoose.connect(process.env.DATABASE_URI)
const db = mongoose.connection

db.on("error", (err) => console.error(err))
db.once("open", () => console.log("Connected to Database"))

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

app.use(
  cors({
    origin: "http://localhost:5173",
  })
)

// Adding clothing name, image, and tags to database
app.post("/items", upload.none(), async (req, res) => {
  const data = JSON.parse(req.body.data)

  try {
    const item = new Item(data)
    await item.save()
    console.log("Added to database")
  } catch (e) {
    console.log(e)
  }
})

app.delete("/images/:key", async (req, res) => {
  const { key } = req.params
  await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise()
  console.log("Successfully deleted image")
})

// Uploading images on the mobile app
app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file
  if (file) {
    try {
      res.json({ key: file.key, url: file.location })
      console.log("Successfully uploaded image")
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Unable to locate file")
  }
})

// Uploading temporary images on website
app.post("/images/upload", upload.single("image"), async (req, res) => {
  const file = req.file
  if (file) {
    try {
      const presignedUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: BUCKET_NAME,
        Key: file.key,
      })
      res.json({ url: presignedUrl })
      console.log("Successfully uploaded image")
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Unable to locate file")
  }
})

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find({}).exec()
    res.json(items)
  } catch (e) {
    console.log(e)
  }
})

app.listen(PORT, () => {
  console.log(`Server started. Listening on Port ${PORT}`)
})

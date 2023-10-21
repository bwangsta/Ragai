const express = require("express")
const s3 = require("../s3")
const upload = require("../upload")

const router = express.Router()
const BUCKET_NAME = process.env.BUCKET_NAME

// Uploading images on the mobile app
router.post("/", upload.single("image"), async (req, res) => {
  const file = req.file
  if (file) {
    try {
      res.json({ key: file.key, url: file.location })
      console.log(`Uploaded image "${file.key}"`)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Failed uploading image")
  }
})

// Uploading temporary images on website
router.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file
  if (file) {
    try {
      const presignedUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: BUCKET_NAME,
        Key: file.key,
      })
      res.json({ url: presignedUrl })
      console.log(`Uploaded temporary image "${file.key}"`)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Failed uploading temporary image")
  }
})

router.delete("/:key", async (req, res) => {
  const { key } = req.params
  await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise()
  console.log("Deleted image")
})

module.exports = router

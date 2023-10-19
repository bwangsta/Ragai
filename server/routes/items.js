const express = require("express")
const upload = require("../upload")
const Item = require("../models/Item")

const router = express.Router()

// Retrieve all clothing items in database
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({}).exec()
    res.json(items)
  } catch (e) {
    console.log(e)
  }
})

// Add clothing name, image, and tags to database
router.post("/", upload.none(), async (req, res) => {
  const data = JSON.parse(req.body.data)

  try {
    const item = new Item(data)
    await item.save()
    console.log("Added to database")
  } catch (e) {
    console.log(e)
  }
})

module.exports = router

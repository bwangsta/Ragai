const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String, required: true, lowercase: true }],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Item", itemSchema)

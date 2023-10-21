const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String, required: true, lowercase: true }],
    embeddings: [{ type: Number, required: true }],
  },
  { timestamps: true },
  { _id: false }
)

module.exports = mongoose.model("Item", itemSchema)

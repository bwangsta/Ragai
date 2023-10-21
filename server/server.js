require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const imageRouter = require("./routes/images")
const itemRouter = require("./routes/items")

mongoose.connect(process.env.DATABASE_URI)
const db = mongoose.connection

const app = express()
const PORT = 3000

app.use(
  cors({
    origin: "http://localhost:5173",
  })
)
app.use("/images", imageRouter)
app.use("/items", itemRouter)

db.on("error", (err) => console.error(err))
db.once("open", () => console.log("Connected to Database"))

app.listen(PORT, () => {
  console.log(`Server started. Listening on Port ${PORT}`)
})

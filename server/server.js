const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/chat", require("./routes/chatRoutes"));

app.use(
  express.static(
    path.join(__dirname, "../client/dist")
  )
);

app.get("*", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../client/dist/index.html"
    )
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
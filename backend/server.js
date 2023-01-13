const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// set up server
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started on PORT: ${PORT}`);
});

// middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(cors({origin: ["http://localhost:3000"], credentials: true}));

// connect to mongoDB
mongoose
  .connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MoongoDB")
});

//set up routes
const userRouter = require("./routes/user-routes");
app.use("/auth", userRouter);

const articleRouter = require("./routes/article-routes");
app.use("/articles", articleRouter);

const statsRouter = require("./routes/stats-routes");
app.use("/stats", statsRouter);

const contactRouter = require("./routes/contact-routes");
app.use("/contact", contactRouter);


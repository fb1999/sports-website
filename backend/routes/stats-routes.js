const express = require("express");
const stats = require("../controllers/stats-controller");

const statsRouter = express.Router();

statsRouter.post("/scrape", stats.saveStats);
statsRouter.get("/table", stats.getStats);

module.exports = statsRouter;
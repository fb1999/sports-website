const express = require("express");
const contact = require("../controllers/contact-controller");

const contactRouter = express.Router();

contactRouter.post("/", contact.contactUs);

module.exports = contactRouter;
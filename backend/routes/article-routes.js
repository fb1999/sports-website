const express = require("express");
const article = require("../controllers/article-controller");
const auth = require("../middleware/auth");

const articleRouter = express.Router();

articleRouter.post("/add", auth, article.createArticle); 
articleRouter.put("/update/:id", article.updateArticle);
articleRouter.delete("/:id", article.deleteArticle);
articleRouter.get("/:id", article.getArticle);
articleRouter.get("/", article.getAllArticles);

module.exports = articleRouter;



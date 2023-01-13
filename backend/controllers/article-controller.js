const Article = require("../models/Article");
const cloudinary = require("../config/cloudinary");

//CREATE ARTICLE
module.exports.createArticle = async (req, res) => {

  const {title, content, image} = req.body;
  const date = Date.now(req.body.date);

  if (!title.length || !content.length ) {
    return res.status(400).send("Content is Required");
  }
  try {
    const result = await cloudinary.uploader.upload(image, {folder: "uploads"});
    const newArticle = new Article({
      title,
      content,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      },
      date
    });
    await newArticle.save();
    res.status(201).send(newArticle);
  } catch (error) {
  return res.status(400).json("Error: " + error.message);
  }
};

//UPDATE ARTICLE
module.exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    const data = {
      title: req.body.title,
      content: req.body.content
    }
    //update image
    if (req.body.image !== '') {
      const ImgId = article.image.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const newImage = await cloudinary.uploader.upload(req.body.image, {folder: "uploads"});

      data.image = {
        public_id: newImage.public_id,
        url: newImage.secure_url
      }
    }
    const updatedArticle = await Article.findOneAndUpdate(req.params.id, data, { new: true })
    
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

//DELETE ARTICLE
module.exports.deleteArticle = async (req, res) => {
  try {
    const currentArticle = await Article.findById(req.params.id);
    //delete image in cloudinary
    const imgId = currentArticle.image.public_id;
    if (imgId) {
      await cloudinary.uploader.destroy(imgId);
    }
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedArticle);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

//FIND ARTICLE BY ID
module.exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.json(article);
  } catch (error) {
    res.status(404).json({ message: "No Article Found" })
  }
};

//GET ALL ARTICLES
module.exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({"createdAt": -1});
    res.json(articles);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};
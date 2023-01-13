const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: {},
    required: true,
    min: 20,
    max: 2000000
  },
  image: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  date: {
      type: Date,
      required: true,
      default: Date.now
  },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Article", articleSchema);
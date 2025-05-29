require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("../models/Property");

const realImages = [
  "https://images.unsplash.com/photo-1560185127-6a8c1f73f5e0",
  "https://images.unsplash.com/photo-1572120360610-d971b9b57c15",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20b",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1570736779402-51eabbf57f45",
  "https://images.unsplash.com/photo-1572120360610-d971b9b57c15",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1570736779402-51eabbf57f45",
  "https://images.unsplash.com/photo-1560185127-6a8c1f73f5e0",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20b",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
  "https://images.unsplash.com/photo-1570736779402-51eabbf57f45",
];

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const properties = await Property.find();

    for (let i = 0; i < properties.length && i < realImages.length; i++) {
      properties[i].image = `${realImages[i]}?auto=format&fit=crop&w=800&q=80`;
      await properties[i].save();
    }

    console.log(
      `✅ Updated ${Math.min(
        properties.length,
        realImages.length
      )} property images with real URLs.`
    );
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating images:", error);
    mongoose.connection.close();
  }
};

updateImages();

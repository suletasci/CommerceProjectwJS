const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sepetimSchema = new Schema({
  stockNumber:{
    type:Number
  },
  productName: {
    type: String,
  },
  productPrice:{
    type:Number
  }
});
module.exports = mongoose.model("sepetim", sepetimSchema);
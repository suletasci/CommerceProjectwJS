const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const productSchema=Schema({
    ids:{
        type:String
    },
    name:{
        type:String
    },
    price:{
        type:Number
    },
    stockNumber:{
        type:Number
    }
});

module.exports=mongoose.model("products",productSchema);
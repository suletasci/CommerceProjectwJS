const mongoose=require("mongoose");

const MONGO_URI='mongodb+srv://AliHaydar:udemy123@cluster0.wkmhh.mongodb.net/webHomework?retryWrites=true&w=majority';
const connectDatabase=()=>{
    mongoose.connect(MONGO_URI,{useNewUrlParser:true,useUnifiedTopology: true}).then(()=>{
        console.log("connection is succesfull");
    })
    .catch(err=>{
        console.log(err);
    })
};

module.exports=connectDatabase;
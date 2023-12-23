import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title : {type : String, required : true, unique : true},
    description : {type : String, required : true},
    rating : {type : Number, required : true},
    image : {type : [String], required : true},
    category : {type : Array, required : true},
    isBestSeller : {type : Boolean , default : false},
    unitAndPrice : [
        {
            unit : {type : String, required : true},
            price : {type : Number, required : true},
        }
    ],
    
}, {timestamps: true})

export default mongoose.model("Product", productSchema);
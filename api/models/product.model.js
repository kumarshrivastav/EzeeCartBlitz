import mongoose from "mongoose"
let productSchema=mongoose.Schema({
    userId:{type:String,required:true},
    name:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    rating:{type:String,required:true},
    category:{type:String,required:true},
    images:[{type:String,required:true}]
},{timeStamp:true})

const productModel=mongoose.models.products || mongoose.model('products',productSchema)
export default productModel;
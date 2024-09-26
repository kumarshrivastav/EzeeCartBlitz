import productModel from "../models/product.model.js"
import ErrorHandler from "../utils/error.handler.js"
import {v2} from "cloudinary"
class ProductController{
    async addProduct(req,res,next){
        try {
            const {userId}=req.params
            if(userId!==req.userId && !req.isAdmin){
                return next(ErrorHandler(401,"Only admin can add product"))
            }
            console.log(req.body)
            console.log(req.files)
            const {name,description,category,rating,price}=req.body
            if(!name || !description || !category || !rating || !price){
                return next(ErrorHandler(400,'please provide all the filed'))
            }
            const existProduct=await productModel.find({name})
            console.log(existProduct)
            if(existProduct?.length!==0){
                return next(ErrorHandler(400,"Product with this name is already exist"))
            }
            const newProduct=req.body
            var images=req?.files
            var uploadPromise;
            if(images?.length !==0){
                uploadPromise=images.map(async (image)=>{
                    const base64=Buffer.from(image.buffer).toString('base64')
                    const dataURI="data:"+image.mimetype+";base64,"+base64
                    const response=await v2.uploader.upload(dataURI)
                    return response.url
                })
            }
            const imageUrls=await Promise.all(uploadPromise)
            newProduct.images=imageUrls
            newProduct.userId=req.userId
            const product=new productModel(newProduct)
            const productSaved=await product.save()
            return res.status(201).send({productSaved,msg:"Product added successfully"})
        } catch (error) {
            next(error)
        }
    }
    async getProducts(req,res,next){
        try {
            const allProducts=await productModel.find()
            return res.status(200).send(allProducts)
        } catch (error) {
            next(error)
        }
    }
    async singleProduct(req,res,next){
        try {
            const {productId}=req.params
            const product=await productModel.findById(productId)
            return res.status(200).send(product)
        } catch (error) {
            next(error)
        }
    }
    async similarProducts(req,res,next){
        try {
            // console.log(req.query)
            const {category}=req.query
            const productListBasedCategory=await productModel.find({category}) 
            // console.log(productListBasedCategory)
            return res.status(200).send(productListBasedCategory)
        } catch (error) {
            next(error)
        }
    }
    async updateProduct(req,res,next){
        try {
            // console.log(req.body?.images)
            // console.log(req.files)
            const {images}=req.body
            // console.log()
            const {userId,productId}=req.params
            if(req.userId !== userId){
                return next(ErrorHandler(400,'Only admin can update the product'))
            }
            const updatedProduct=await productModel.findByIdAndUpdate(productId,{$set:req.body},{new:true})
            var uploadedPromises
            if(req?.files?.length>0){
                uploadedPromises=req.files.map(async(file)=>{
                    const base64=Buffer.from(file.buffer).toString('base64')
                    const dataURI='data:'+file.mimetype+";base64,"+base64;
                    const response=await v2.uploader.upload(dataURI)
                    return response.url
                })
            }
            if(uploadedPromises){
                const imageUrls=await Promise.all(uploadedPromises)
                console.log(imageUrls)
                if(Array.isArray(images) && images?.length>0){
                    updatedProduct.images.push(...imageUrls)
                }
                else{
                    updatedProduct.images=[...imageUrls]
                }           
            }
           const savedUpdatedProduct= await updatedProduct.save()
           console.log(savedUpdatedProduct)
            return res.status(201).send({msg:'Product Updated Successfully',savedUpdatedProduct})
        } catch (error) {
            next(error)
        }
    }
}

export default new ProductController();
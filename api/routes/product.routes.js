import express from "express"
import verifyToken from "../utils/middleware.js"
import multer from "multer"
import productController from "../controllers/productController.js"
const router=express.Router()
const storage=multer.memoryStorage()
const upload=multer({storage,limits:{fileSize:1024*1024*8}})
router.post('/addproduct/:userId',verifyToken,upload.array('images',3),productController.addProduct)
router.get("/getproducts",productController.getProducts)
router.get("/singleproduct/:productId",productController.singleProduct)
router.get("/similarproducts",productController.similarProducts)
router.post("/updateproduct/:userId/:productId",verifyToken,upload.array('imageFiles',3),productController.updateProduct)
router.post("/create-checkout-session/:userId",verifyToken,productController.createCheckoutSession)
router.post("/create-payment-intent/:userId",verifyToken,productController.createPaymentIntent)
router.delete("/delete-product-by-id/:productId",verifyToken,productController.deleteProductById)
router.get("/productbysearch",productController.productBySearch)
router.get("/productbyselect",productController.categorySelector)
export default router
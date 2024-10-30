import productModel from "../models/product.model.js";
import calculateProductAmount from "../utils/calculateProductAmount.js";
import ErrorHandler from "../utils/error.handler.js";
import { v2 } from "cloudinary";
import Stripe from "stripe";
class ProductController {
  async addProduct(req, res, next) {
    try {
      const { userId } = req.params;
      if (userId !== req.userId && !req.isAdmin) {
        return next(ErrorHandler(401, "Only admin can add product"));
      }
      const { name, description, category, rating, price } = req.body;
      if (!name || !description || !category || !rating || !price) {
        return next(ErrorHandler(400, "please provide all the filed"));
      }
      const existProduct = await productModel.find({ name });
      if (existProduct?.length !== 0) {
        return next(
          ErrorHandler(400, "Product with this name is already exist")
        );
      }
      const newProduct = req.body;
      var images = req?.files;
      var uploadPromise;
      if (images?.length !== 0) {
        uploadPromise = images.map(async (image) => {
          const base64 = Buffer.from(image.buffer).toString("base64");
          const dataURI = "data:" + image.mimetype + ";base64," + base64;
          const response = await v2.uploader.upload(dataURI);
          return response.url;
        });
      }
      const imageUrls = await Promise.all(uploadPromise);
      newProduct.images = imageUrls;
      newProduct.userId = req.userId;
      const product = new productModel(newProduct);
      const productSaved = await product.save();
      return res
        .status(201)
        .send({ productSaved, msg: "Product added successfully" });
    } catch (error) {
      next(error);
    }
  }
  async getProducts(req, res, next) {
    try {
      const allProducts = await productModel.find();
      return res.status(200).send(allProducts);
    } catch (error) {
      next(error);
    }
  }
  async singleProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await productModel.findById(productId);
      return res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  }
  async similarProducts(req, res, next) {
    try {
      const { category } = req.query;
      const productListBasedCategory = await productModel.find({ category });
      return res.status(200).send(productListBasedCategory);
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    try {
      const { images } = req.body;
      const { userId, productId } = req.params;
      if (req.userId !== userId) {
        return next(ErrorHandler(400, "Only admin can update the product"));
      }
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { $set: req.body },
        { new: true }
      );
      var uploadedPromises;
      if (req?.files?.length > 0) {
        uploadedPromises = req.files.map(async (file) => {
          const base64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = "data:" + file.mimetype + ";base64," + base64;
          const response = await v2.uploader.upload(dataURI);
          return response.url;
        });
      }
      if (uploadedPromises) {
        const imageUrls = await Promise.all(uploadedPromises);
        console.log(imageUrls);
        if (Array.isArray(images) && images?.length > 0) {
          updatedProduct.images.push(...imageUrls);
        } else {
          updatedProduct.images = [...imageUrls];
        }
      }
      const savedUpdatedProduct = await updatedProduct.save();
      return res
        .status(201)
        .send({ msg: "Product Updated Successfully", savedUpdatedProduct });
    } catch (error) {
      next(error);
    }
  }

  async createPaymentIntent(req, res, next) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
      const { products, customerInfo } = req.body;
      if (!customerInfo || !customerInfo.customerName) {
        return next(ErrorHandler(400, "Customer Information is Incomplete"));
      }
      const paymentIntent = await stripe.paymentIntents.create({
        description: "Payment for products purchased by ezee cart blitz",
        amount: calculateProductAmount(products),
        currency: "inr",
        payment_method_types: ["card"],
        shipping: {
          name: customerInfo?.customerName || "Default Name",
          address: {
            line1: customerInfo?.addressLine1 || "Default Address Line 1",
            line2: customerInfo?.addressLine2 || "Default Address Line 2",
            city: customerInfo?.customerCity || "Default City",
            state: customerInfo?.customerState || "Default State",
            postal_code: customerInfo?.postalCode || "000000",
            country: customerInfo?.customerCountry || "IN",
          },
        },
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteProductById(req, res, next) {
    try {
      const { productId } = req.params;
      const deleteProduct = await productModel.findByIdAndDelete(productId);
      if (!deleteProduct) {
        return next(ErrorHandler(400, "Product not found"));
      }
      return res.status(201).send("Product Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async productBySearch(req, res, next) {
    try {
      const searchQuery = {
        ...(req.query.searchTerm && {
          $or: [
            { name: { $regex: req.query.searchTerm, $options: "i" } },
            { description: { $regex: req.query.searchTerm, $options: "i" } },
            { category: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      };
      const products = await productModel.find(searchQuery);
      return res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
  async categorySelector(req, res, next) {
    try {
      const searchQuery =
        req.query.categorySelector === "All"
          ? {}
          : {
              category: { $regex: req.query.categorySelector, $options: "i" },
            };
      const products = await productModel.find(searchQuery);
      return res.status(200).send(products);
    } catch (error) {}
  }
}

export default new ProductController();

import express from "express";
const router = express.Router();
import { createProduct, deleteProduct, getAllBestSellerProducts, getAllProduct, getAllProducts, getAllProductsByCategory, getAllTopRatedProducts, getBestSellerProducts, getProduct, getSimilarProduct, getTopRatedProducts, searchProduct, updateProduct } from '../controller/product.js';
import { verifyAdmin } from './../uitls/verifyToken.js';

//CREATE PRODUCT
// router.post("/", verifyAdmin, createProduct);
router.post("/", createProduct);

//UPDATE PRODUCT
// router.put("/:id", verifyAdmin, updateProduct);
router.put("/:id", updateProduct);

//DELETE PRODUCT
// router.delete("/:id", verifyAdmin, deleteProduct);
router.delete("/:id", deleteProduct);

//GET PRODUCT
router.get("/find/:id", getProduct);

//GET ALL PRODUCTS
router.get("/", getAllProducts);

//GET ALL PRODUCTS
router.get("/product", getAllProduct);

//GET ALL PRODUCTS BY CATEGORY
router.get("/category/:category", getAllProductsByCategory);

// GET TOPRATED
router.get("/toprated", getTopRatedProducts);

//GET ALL TOPRATED
router.get("/alltoprated", getAllTopRatedProducts);

// GET BESTSELLER
router.get("/bestseller", getBestSellerProducts);

// GET ALL BESTSELLER
router.get("/allbestseller", getAllBestSellerProducts);

//SEARCH QUERY
router.get("/searchApi" , searchProduct);

//GET SIMILAR PRODUCT
router.get("/similar/:title" , getSimilarProduct);


export default router;
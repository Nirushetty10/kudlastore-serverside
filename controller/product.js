import express from "express";
import Product from "../model/Product.js";
import multer  from 'multer';
const app = express();

Product.collection.createIndex({ title: "text" });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Set the file name
    },
  });
  
  export const upload = multer({
    storage: storage,
  }).any();


export const createProduct = async (req,res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error('File upload failed:', err);
              return res.status(500).json({ error: 'File upload failed', details: err });
            }
        const {image,...other} = req.body;
        const imagePath = req.files.map((file) => file.path);
        const unitAndPrice = [];
        for (let i = 0; i < other.unitAndPrice.length; i++) {
            unitAndPrice.push(JSON.parse(other.unitAndPrice[i]));
        }
        const newProduct = new Product({ ...other,unitAndPrice,image:imagePath});
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
        })
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
}

export const updateProduct = async (req,res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error('File upload failed:', err);
              return res.status(500).json({ error: 'File upload failed', details: err });
            }
        const {image,...other} = req.body;
        const imagePath = req.files.map((file) => file.path);
        const unitAndPrice = [];
        for (let i = 0; i < other.unitAndPrice.length; i++) {
            unitAndPrice.push(JSON.parse(other.unitAndPrice[i]));
        }
        const updatedFeilds = {
            ...other,
            unitAndPrice,
            image: imagePath.length > 0 ? imagePath : image
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
           $set : updatedFeilds
        },
        { new : true}
        )
        res.status(200).json(updatedProduct);
    })
    } catch (error) {
        res.status(500).json("Product not found");
    }
}

export const deleteProduct = async(req,res)=> {
    const id = req.params.id;
    try {
        await Product.findByIdAndDelete(id)
        res.status(200).json("Product deleted successfully");
    } catch(err) {
        res.status(500).json("Product not found");
    }
}

export const getProduct = async(req,res)=> {
    const id = req.params.id;
    try {
        let product = await Product.findById(id)
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json("product not found");
    }
}

export const getAllProducts = async(req,res)=> {
    try {
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;
        // const skip = (page - 1) * limit;
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json("Products not found");
    }
}

export const getAllProduct = async(req,res)=> {
    try {
        let products = await Product.find().limit(8);
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json("products not found");
    }
}

export const getAllProductsByCategory = async(req,res)=> {
    try {
        let products = await Product.find({ category : { $in : [req.params.category]}});
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json("products not found");
    }
}

export const getTopRatedProducts = async(req,res)=> {
    try {
        let products = await Product.find().sort({rating : -1}).limit(4);
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json("products not found");
    }
}

export const getAllTopRatedProducts = async(req,res)=> {
    try {
        let products = await Product.find().sort({rating : -1});
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json("products not found");
    }
}

export const getBestSellerProducts = async(req,res)=> {
    try {
        let products = await Product.find({isBestSeller : true}).limit(4);
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json("products not found");
    }
}

export const getAllBestSellerProducts = async(req,res)=> {
    try {
        let products = await Product.find({isBestSeller : true});
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json("products not found");
    }
}

export const searchProduct = async(req,res) => {
    try {
       const { letter } = req.query;
       const regex = new RegExp(letter, 'i');
        const query = {
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
        ],
        };
       const products = await Product.find(query).exec();
        if (products.length === 0) {
          return res.status(404).json({ message: "No matching products found" });
        }
        products.sort((a, b) => {
            // Compare the title and then the description
            if (a.title.includes(letter) && !b.title.includes(letter)) {
                return -1;
            } else if (!a.title.includes(letter) && b.title.includes(letter)) {
                return 1;
            } else if (a.description.includes(letter) && !b.description.includes(letter)) {
                return -1;
            } else if (!a.description.includes(letter) && b.description.includes(letter)) {
                return 1;
            } else {
                return 0;
            }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSimilarProduct = async(req,res) => {
    try {
        let product = await Product.find(
            { $text: { $search: req.params.title },
              title: { $ne: req.params.title }
            },
            { score: { $meta: "textScore" } }
          ).sort({ score: { $meta: "textScore" } });

        if(product.length === 0) {
            const originalProduct = await Product.findOne({ title: req.params.title });
            if (originalProduct) {
                product = await Product.find({ category: originalProduct.category }).limit(6);
            }
        }
        res.status(200).json(product)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
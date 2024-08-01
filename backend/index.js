const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');

app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb+srv://ibrahimzia:ibrahimzia@cluster0.g1yo7wt.mongodb.net/e-commerce';

// Connect to MongoDB
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', () => {
    console.log('MongoDB connected successfully');
});

//Api endpoint creation

app.get("/", (req, res) => {
    res.send("Espress APP is Running")
})

//using multer for image storage engine
//middleware
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
//object passed to multer
const upload = multer({ storage: storage });

//endpoint to upload the image
app.use('/images',express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res) => {
    if (req.file) {
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`
        });
    } else {
        res.status(400).json({ success: 0, message: 'No file uploaded' });
    }
});

//endpoint for adding product to mogodb atlas
//schema before adding product to mogodb
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default: Date.now,
    },
    available:{
        type:Boolean,
        default: true,
    },
})

app.post('/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product = products[products.length - 1];
            id = last_product.id + 1;
    }else{
        id = 1;  // if there are no products in the database, the id will start from 1
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save(); // save product in mongodb
    console.log("saved");
    res.json({
        success: true,
        name: req.body.name,
    });
})

//creation API for deleting product

app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({
        id:req.body.id
    });
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    });
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error starting server" + error);
    }
})

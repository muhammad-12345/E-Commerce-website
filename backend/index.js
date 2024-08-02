const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');
const { log } = require('console');

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
app.use('/images', express.static('upload/images'))
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
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
})

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product = products[products.length - 1];
        id = last_product.id + 1;
    } else {
        id = 1;  // if there are no products in the database, the id will start from 1
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
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

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({
        id: req.body.id
    });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    });
})

//creating endpoint to display products on frontend
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("all products fetched");
    res.send(products);
})


//user schema

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// API to create USER 

app.post('/signup', async (req, res) => {
    try {
        console.log('Request body:', req.body);

        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, error: "existing user found with same email Address" })
        }

        //if no user
        //then create an empty cart
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        //create user
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        //save the user in DB
        await user.save();
        //use jwt authentication
        const data = {
            user: {
                id: user.id,
            }
        };
        //added salt for unreadable token 
        const token = jwt.sign(data, 'secret_ecom');
        res.json({
            success: true,
            token
        });
    } catch (error) {
        console.error('Error in /signup:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


//endpoint for user login

app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({
            email: req.body.email
        });
        // If user exists
        if (user) {
            const passCompare = req.body.password === user.password;
            // If password matches
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                };
                // Generate token
                const token = jwt.sign(data, 'secret_ecom');
                res.json({
                    success: true,
                    token
                });
            } else {
                // If password is incorrect
                res.json({
                    success: false,
                    error: "Incorrect password"
                });
            }
        } else {
            // If email does not match
            res.json({
                success: false,
                error: "Email does not match"
            });
        }
    } catch (err) {
        console.error('Error in /login:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


//creating endpoint for new collecction data

app.get('/newcollection', async (req, res) => {
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collection fetched");
    res.send(newcollection);
})

//popular in women category endpoint

app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popularInWomen = products.slice(0, 4);
    console.log("Popular in Women fetched");
    res.send(popularInWomen);
})


//middleware for addtocart  function
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    console.log("Fetching user")
    if (!token) {
        res.status(401).send({ error: "token not found" });
    } else {
        console.log(token)
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            console.error("Token verification failed:", error.message); // Log the error message
            res.status(401).send({ error: "Please authenticate using a valid token" });
        }
    }
}

//endpoint for saving data in cart

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        console.log("added", req.body.itemId)

        // Find the user by ID
        let userData = await Users.findOne({
            _id: req.user.id
        });

        // Increment the item count in the cart
        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;

        // Update the user's cartData in the database
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: userData.cartData }
        );

        // Respond to the client
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Error in adding to cart:", error);
        res.status(500).send("Internal server error");
    }
});

//endpoint to remove from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        console.log("Removing item:", req.body.itemId);

        // Find the user by ID
        let userData = await Users.findById(req.user.id);

        // Ensure cartData is an object
        if (!userData.cartData || typeof userData.cartData !== 'object') {
            return res.status(400).json({ success: false, message: "Cart data is not valid" });
        }

        // Check if the item exists in the cart and has a count > 0
        if (userData.cartData[req.body.itemId] && userData.cartData[req.body.itemId] > 0) {
            // Decrement the item count in the cart
            userData.cartData[req.body.itemId] -= 1;

            // Update the user's cartData in the database
            await Users.findByIdAndUpdate(
                req.user.id,
                { cartData: userData.cartData }
            );

            // Respond to the client
            res.json({ success: true, message: "Removed from cart" });
        } else {
            res.status(400).json({ success: false, message: "Item not in cart or quantity is zero" });
        }
    } catch (error) {
        console.error("Error in removing from cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//creating endpoint to get cart dataapp.post('/getcart', fetchUser, async (req,res)=>{
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        console.log("Get Cart for user:", req.user.id);
        const userData = await Users.findById(req.user.id);
        console.log("User cart data:", userData.cartData);

        if (userData && userData.cartData) {
            res.json(userData.cartData);
        } else {
            res.status(404).json({ error: "No cart data found" });
        }
    } catch (error) {
        console.error("Error in getting cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error starting server" + error);
    }
})

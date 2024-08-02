/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/Admin_Assets/upload_area.svg'

const AddProduct = () => {

    const [image, setImage] = useState(false)
    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:"",
    })

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) =>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    // By marking the function as async, you can use await to wait for these 
    // asynchronous operations to complete before proceeding to the next line of code.

    // adding logic to link to the backend
    const Add_Product = async () => {
        console.log(productDetails);
        //upload endpoint for image
        let responseData;
        let product = productDetails;
        // formdata object for images
        let formData = new FormData();
        formData.append('product',image);
        // hitting upload API to upload image
        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'Application/json',
            },
            body:formData,
        })
        .then((resp) => resp.json())//response converted to json and returns a promise
        .then((data)=>{responseData=data});// response data stored to variable
        // promise used to handle asyn operations
        // then() called when promise resolved

        if(responseData.success){
            product.image = responseData.image_url
            console.log(product)
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("product added"):alert("failed")
            })
        }
    }

    return (
        <div className='addproduct'>
            <div className="addproduct-itemfields">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfields">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfields">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type='text' name='new_price' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfields">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kids</option>
                </select>
            </div>
            <div className="addproduct-itemfields">
                <label htmlFor="file-input">
                    {/* if image is true it will pass the image to url creation if false it will display upload area */}
                    <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt='' />
                </label>
                <input onChange={imageHandler} type="file" id="file-input" name="image" hidden />
            </div>
            <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct

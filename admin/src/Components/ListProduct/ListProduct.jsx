/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/Admin_Assets/cross_icon.png'

const ListProduct = () => {

  // Logic for fetching data from API
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      });
  }

  // To run this function whenever this component is mounted, we use useEffect
  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    })
    await fetchInfo();
  }

  return (
    <div className='listproduct'>
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => (
          <React.Fragment key={product.id}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className='listproduct-product-image' />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={() => { removeProduct(product.id) }} src={cross_icon} alt="" className='listproduct-remove-icon' />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default ListProduct

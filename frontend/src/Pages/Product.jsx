import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext.jsx';
import { useParams } from 'react-router-dom'
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay.jsx';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox.jsx';
import RelatedProduct from '../Components/RelatedProduct/RelatedProduct.jsx';

const Product = () => {
  const { all_products } = useContext(ShopContext); 
  const { productId } = useParams();

  const product = all_products.find((e) => e.id === Number(productId));

  if (!product) {
    return <div>Product not found</div>; 
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product}/>
      <DescriptionBox />
      <RelatedProduct />
    </div>
  )
}

export default Product;

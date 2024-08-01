import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='description-box'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">
            Description
        </div>
        <div className="descriptionbox-nav-box fade">
            Reviews (122)
        </div>
      </div>
      <div className="descriptionbox-description">
        <p>An e-commerce website is an online platform designed to facilitate 
            the buying and selling of goods or services over the internet. It 
            allows businesses to showcase their products or services through detailed listings, 
            complete with images, descriptions, and pricing. Customers can browse these offerings, add items to a 
            virtual shopping cart, and complete purchases using secure payment methods.</p>
        <p>E-commerce websites often include features like user accounts, order tracking, 
            customer reviews, and various shipping options, creating a convenient and 
            comprehensive shopping experience for both buyers and sellers.</p>
      </div>
    </div>
  )
}

export default DescriptionBox

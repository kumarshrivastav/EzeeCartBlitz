import React, { Fragment } from 'react'
import {List} from "flowbite-react"
import {v4 as uuidV4} from "uuid"
import CartBuyButton from './CartBuyButton';
import { useSelector } from 'react-redux';
const CartNumber = () => {
  const {cartItems} =useSelector(state=>state.cart)
  var cartNumbers = {
		subtotal: 0,
		shipping: 0,
		tax: 0,
		total: 0,
	};
  if(cartItems.length>0){
    for (let index = 0; index < cartItems.length; index++) {
      const product = cartItems[index];
      cartNumbers.subtotal+=product.price;
    }
    cartNumbers.tax=((cartNumbers.subtotal*18)/100)
    cartNumbers.shipping=40.00
    cartNumbers.total=((cartNumbers.subtotal)+(cartNumbers.tax)+(cartNumbers.shipping)).toFixed(2)
  }
   
    const items = [
		{ title: "Subtotal", price: cartNumbers.subtotal },
		{ title: "Shipping", price: cartNumbers.shipping },
		{ title: "tax", price: cartNumbers.tax },
		{ title: "Total (INR)", price: cartNumbers.total },
	];
  return (
    <List unstyled className='my-3  border-2 border-dashed border-white p-1'>
        {
            items.map((item)=>(
                <Fragment key={uuidV4()}>
                <List.Item key={uuidV4()} className='flex justify-between Cart-Item'>
                    <span className='font-serif text-sm text-gray-300 lg:text-lg'>{item.title}</span>
                    <span className='font-serif text-sm text-gray-200 lg:text-lg'>{item.price}</span>
                </List.Item>
                <hr className='border-dashed'/></Fragment>
            ))
        }
        <CartBuyButton/>
    </List>
  )
}

export default CartNumber

import React from 'react'
import {Button} from "flowbite-react"
import { useDispatch } from 'react-redux'
import { toggelToRemoveAndAddItem } from '../../redux/cartSlice'
const AddToCart = ({product}) => {
    const dispatch=useDispatch()
    const handleClick=()=>{
        dispatch(toggelToRemoveAndAddItem(product))
    }
  return (
    <Button outline gradientDuoTone="tealToLime" onClick={handleClick} className='w-full font-serif'>Add to Cart</Button>
  )
}

export default AddToCart

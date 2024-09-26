import React from 'react'
import Product from './Product'
import {v4 as uuid} from "uuid"
const Products = ({data}) => {
  // console.log(data)
  return (
    <div className='grid  grid-cols-1 m-3 gap-2 md:grid-cols-3 md:gap-2  lg:grid-cols-4 lg:gap-3'>
      {
        data?.map((product)=>{
            return (
                <Product product={product} key={uuid()}/>
            )
        })
      }
    </div>
  )
}

export default Products

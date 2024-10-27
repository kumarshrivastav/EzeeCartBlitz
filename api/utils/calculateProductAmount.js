export default function calculateProductAmount(products){
    let total=0
    products.forEach((product)=>{
        total+=product.price
    })
    return total*100
}
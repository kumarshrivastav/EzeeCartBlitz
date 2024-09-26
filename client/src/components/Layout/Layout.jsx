import React from 'react'
import Footter from '../Footer/Footter'
import Header from '../Navbar/Navbar'

const Layout = ({children}) => {
  return (
    <div className='flex flex-col min-h-screen'>
    <Header title="Ezee-Cart-Blitz"/>
      <div className='flex-1'>
      {children}
      </div>
      <Footter/>
    </div>
  )
}

export default Layout

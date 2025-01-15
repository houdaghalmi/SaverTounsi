import React from 'react'
import Meta from "./Meta"
import Header from "./Header"
import Footer from './Footer'
import FormLogin from './FormLogin'
const Layout = ({children}:any) => {
  return (
    <>
    <Meta/>
    <div >
        <main >
          <Header/>
           {children}
           <FormLogin/>
           <Footer/>
        </main>

    </div>
    </>
  )
}

export default Layout;
import { Box } from '@mui/material'
import React from 'react'
import Header from '../header/Header'
import Banner from '../banner/Banner'
import { Outlet } from 'react-router-dom'
import Footer from '../footer/Footer'
import ScrollToTopButton from '../scrollToTop/ScrollToTopButton'

const WrapLayoutCustomer = () => {
  return (
    <Box>
        <Header />
        <Banner />
        <ScrollToTopButton />
        <Outlet/>
        <Footer/>
    </Box>
  )
}

export default WrapLayoutCustomer
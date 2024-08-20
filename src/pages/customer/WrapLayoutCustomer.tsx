import { Box } from '@mui/material'
import React from 'react'
import Header from '../../components/common/header/Header'
import Banner from '../../components/common/banner/Banner'
import { Outlet } from 'react-router-dom'

const WrapLayoutCustomer = () => {
  return (
    <Box>
        <Header />
        <Banner />
        <Outlet/>
    </Box>
  )
}

export default WrapLayoutCustomer
import { Box } from '@chakra-ui/react'
import React from 'react'
import { LogoImage } from '../../assets'

export default function Logo() {
  return (
    <Box p={4} h={100} w={100}><img src={LogoImage}/></Box>
  )
}

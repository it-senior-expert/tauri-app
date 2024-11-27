import React, { ReactNode, useEffect, useState } from 'react';
import { useOutlet } from 'react-router-dom';
import { useWindowSize } from '@react-hook/window-size';
import { Box, Flex, Button, FlexProps, Input, Text, useDisclosure, useToast } from '@chakra-ui/react';
import Sidebar from '../../Sidebar';

type Props = {
  children?: React.ReactNode;
}

const SidebarLayout = (props: Props) => {
  const [frameWidth, setFrameWidth] = useState(0.2 * window.innerWidth); // 20% default width
  const outlet = useOutlet();

  return (
    <Flex
      height="100vh"
      direction={{ base: "column", md: "row" }}
      justify="space-around"
    >
      <Box
        width={{ base: "100%", md: `calc(100% - ${frameWidth}px)` }}
        padding="1"
        borderRadius='10px'
        height='100%'
      >
        {outlet}
      </Box>

      <Box
        width={{ base: "100%", md: `${frameWidth}px` }}
        padding="1"
        borderRadius='10px'
      >
        <Sidebar />
      </Box>

    </Flex>

  )
}

export default SidebarLayout

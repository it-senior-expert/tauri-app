import React, { useState } from 'react'
import { Box, Flex, Text, Input, Button, useToast } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';


const WelcomePage: React.FC = () => {
  const [url, setUrl] = useState('https://v2.tauri.app/learn/');

  return (
    <Box h='100%' p='4' backgroundColor='lightslategray' borderRadius='10px'>
      <Box as="section" whiteSpace="nowrap" textAlign="center">
        <Heading>Welcome to Tauri</Heading>
      </Box>

      <Box
        padding="4"
        height="calc(100% - 48px)"
        borderRadius='10px'
      >

        <Input
          placeholder="Enter page URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          color='black'
          mb='4'
        />
        <Box
          as="iframe"
          src={url}
          width="100%"
          border="none"
          height="calc(100% - 62px)"
          pt="0"
          display={url ? "block" : "none"}
        />
      </Box>
    </Box>

  )
}

export default WelcomePage;

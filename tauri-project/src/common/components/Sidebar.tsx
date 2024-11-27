import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Flex, Button, Text, Select } from '@chakra-ui/react';

const Sidebar = () => {

    const [urls, setUrls] = useState([
        'https://chatgpt.com/',
        'https://v2.tauri.app/blog/tauri-20/',
        'https://dev.to/dubisdev/creating-your-first-tauri-app-with-react-a-beginners-guide-3eb2',
        'https://v2.tauri.app/start/prerequisites/',
        'https://github.com/tauri-apps',
    ]);

    function moveItemToFirst<T>(array: T[], itemName: T): T[] {
        const index = array.indexOf(itemName);

        if (index !== -1) {
            array.splice(index, 1);
            array.unshift(itemName);
        }

        return array;
    }


    const handleSelectURL = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUrls(moveItemToFirst(urls, event.target.value))
    }

    return (
        <Box
            background="gray.600"
            color="white"
            padding="4"
            display="flex"
            borderRadius='10px'
            flexDirection="column"
            height='100%'
        >
            <Flex
                justify="space-between"
                align="center"
                marginBottom="4"
                direction={{ base: "column" }}
            >
                <Text fontSize="lg" marginBottom={{ base: "2", md: "0" }}>
                    Select URL
                </Text>
                <Select onChange={handleSelectURL}>
                    {
                        urls.map((item, idx) => (
                            <option value={item} key={`url-${idx}`}>{item}</option>
                        ))
                    }
                </Select>
            </Flex>
            <Flex
                overflow='auto'
                justify="space-between"
                direction={{ base: "column" }}>
                {
                    urls.map((url, idx) => (
                        <Box
                            as="iframe"
                            src={url}
                            width="100%"
                            p="1"
                            key={`iframe-${idx}`}
                            display={url ? "block" : "none"}
                        />
                    ))
                }
            </Flex>
        </Box>
    )
}

export default Sidebar
import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Flex, Button, Text, Select } from '@chakra-ui/react';

import { saveToLocalStorage, loadFromLocalStorage } from '../services/store';

const Sidebar = () => {

    const [urls, setUrls] = useState<string[]>([
        'https://chatgpt.com/',
        'https://translate.google.com/?sl=en&tl=tum&op=translate',
        'https://v2.tauri.app/blog/tauri-20/',
        'https://v2.tauri.app/start/prerequisites/',
        'https://github.com/tauri-apps',
    ]);
    const proxyUrl = `http://localhost:3000/proxy?url=`;

    const [url, setUrl] = useState<string>(urls[0]);
    // const [url, setUrl] = useState<string>('');

    const handleSelectURL = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUrl(event.target.value);
    }

    // useEffect(() => {
    //     const fetchUrls = async () => {
    //         try {
    //             const fetchedUrls = await getData('urls');
    //             setUrls(fetchedUrls);
    //         } catch (error) {
    //             console.error('Error fetching URLs:', error);
    //         }
    //     };

    //     fetchUrls();
    // }, []);

    useEffect(() => {
        const setNewUrls = async () => {
            try {
                await saveToLocalStorage('urls', urls)
            } catch (error) {
                console.error('Error fetching URLs:', error)
            }
        }

        setNewUrls()
    }, [urls])

    return (
        <Box
            background="gray.600"
            color="white"
            padding="2"
            display="flex"
            borderRadius='10px'
            flexDirection="column"
            height='100%'
            alignItems='center'
        >
            {/* <Box
                justifyContent="center"
                marginBottom="4"
            >
                <Text marginBottom={{ base: "2", md: "0" }}>
                    Select URL
                </Text>
                <Select onChange={handleSelectURL}>
                    {
                        urls.map((item, idx) => (
                            <option value={item} key={`url-${idx}`}>{item}</option>
                        ))
                    }
                </Select>
            </Box> */}
            <Box
                as="iframe"
                src={url}
                width="100%"
                maxWidth='400px'
                display={url ? "block" : "none"}
            />
        </Box>
    )
}

export default Sidebar
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Input, useToast } from "@chakra-ui/react";
import { Toast } from '@/components/Common/toast';

const DashboardPage: React.FC = () => {
  const [url, setUrl] = useState<string>('https://www.oracle.com/java/');
  const [error, setError] = useState<boolean>(false);
  const [proxyUrl, setProxyUrl] = useState<string>('');
  const toast = useToast();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setProxyUrl(`http://localhost:3000/proxy?url=${url}`);
      Toast(toast, {
        title: "Notification Title",
        description: "This is the notification description.",
        status: "success",
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    setProxyUrl(`http://localhost:3000/proxy?url=${url}`);
  }, [url]);

  return (
    <Box h="100%" p="2" backgroundColor="gray.600" borderRadius="10px">
      <Box height="100%" borderRadius="10px">
        <Input
          // placeholder="Enter page URL"
          value={url}
          onKeyDown={handleKeyDown}
          onChange={(e) => setUrl(e.target.value)}
          color="white"
          mb="2"
        />
        {url ? (
          <Box
            as="iframe"
            src={proxyUrl}
            style={{
              width: '100%',
              minHeight: '300px',
              height: 'calc(100% - 50px)',
              border: 'none',
            }}
            title="Website Viewer"
            onError={() => setError(true)}
          ></Box>
        ) : (
          <Text>No website loaded. Click a button to display a website.</Text>
        )}
        {error && <Text color="red.500">Error loading the page. Try another URL.</Text>}
      </Box>
    </Box>
  );
};

export default DashboardPage;

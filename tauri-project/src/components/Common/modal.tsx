import React, { useEffect, useState } from "react";
import { ChakraProvider, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";

export const SiteModal: React.FC = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [websiteName, setWebsiteName] = useState<string>("");

  return (
    <ChakraProvider>
      <div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Website</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter website name"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={props.handleSubmit}>
                Add
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </ChakraProvider>
  );
};

export default SiteModal;

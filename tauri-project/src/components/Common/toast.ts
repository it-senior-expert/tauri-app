import { useToast, UseToastOptions } from "@chakra-ui/react";

// Define a notification function
export const Toast = (
  toast: ReturnType<typeof useToast>,
  options: UseToastOptions
): void => {
  toast({
    ...options,
    duration: options.duration ?? 5000, // Default duration if not provided
    isClosable: options.isClosable ?? true, // Default to closable
  });
};

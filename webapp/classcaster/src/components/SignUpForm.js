import React from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

export default function SignUpForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef();
  const finalRef = React.useRef();

  return (
    <div>
      <Button
        colorScheme={"blue"}
        bg={"blue.300"}
        rounded={"full"}
        px={6}
        _hover={{
          bg: "blue.500",
        }}
        onClick={onOpen}
      >
        Sign Up
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <form method="POST" action="/signup">
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  ref={initialRef}
                  placeholder="Lionel Messi"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Username</FormLabel>
                <Input name="username" placeholder="lionel" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input placeholder="Password" name="password" type="password" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Sign Up
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}

import React from "react";
import { Button, Square, VStack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function LogOutPage() {
  return (
    <Square h="100vh" w="100vw">
      <VStack>
        <Text>Are you sure you want to sign out?</Text>
        <form method="POST" action="/logout">
          <Button type="submit" colorScheme="blue">
            Log Out
          </Button>
        </form>
      </VStack>
    </Square>
  );
}

import { Square, Spinner, VStack, Text } from "@chakra-ui/react";

export const PageSpinner = ({text="Loading..."}) => {
    return (<Square h="100vh" w="100vw">
        <VStack spacing={4}>
            <Spinner color="red.300" />
            <Text fontSize="2xl">{text}</Text>
        </VStack>
    </Square> )
};
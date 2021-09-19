import React from "react";
import {
    Box,
    Text,
    Stack,
} from "@chakra-ui/react";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";

const StudentCard = (props) => {
    return (
        <Box
        w="24rem"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        m={3}
        >
        <Box p="4" mx={6}>
            <Box
            fontWeight="semibold"
            fontSize="xl"
            as="h4"
            lineHeight="tight"
            isTruncated
            >
            {props.name}
            </Box>

            <Box>
            <Stack direction={"row"} flex={true} alignItems={"center"} >
                <CheckIcon />
                <Text fontSize="lg">
                Potential Group Match
                </Text>
            </Stack>
            
            <Stack direction={"row"} flex={true} alignItems={"center"} mt={1}>
                <WarningTwoIcon />
                <Text fontSize="lg">
                    <b>{props.ratio}% </b> confidence
                </Text>
            </Stack>
            
            </Box>
        </Box>
        </Box>
    );
}

export default StudentCard;
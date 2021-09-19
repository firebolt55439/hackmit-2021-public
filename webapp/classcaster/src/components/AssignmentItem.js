import React from "react";
import { Box, Badge, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";

function AssignmentItem(props) {
  const isNew =
    moment(props.daysCreated).diff(moment.now(), "days") >= -3 ? false : true;
  return (
    <Box
      w="28rem"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      m={3}
      mb={9}
    >
      <Box p="6">
        <Box d="flex" alignItems="baseline">
          {isNew ? (
            <div></div>
          ) : (
            <Badge borderRadius="full" px="2" colorScheme="teal">
              New
            </Badge>
          )}
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            Created {moment(props.daysCreated).fromNow()}
          </Box>
        </Box>

        <Box
          margin=".5rem 0 .5rem 0"
          fontWeight="semibold"
          fontSize="xl"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {props.name}
        </Box>

        <Box>
          <Stack direction={"row"} flex={true} alignItems={"center"} mt={1}>
            <CheckIcon />
            <Text fontSize="lg">
              <b>{props.numCompleted}</b> out of <b>{props.numStudents}</b>{" "}
              students have completed.
            </Text>
          </Stack>
          {!props.completed ? (
            <Stack direction={"row"} flex={true} alignItems={"center"} mt={1}>
              <WarningTwoIcon />
              <Text fontSize="lg">
                <b>{props.forecastTime} hours</b> forecast time
              </Text>
            </Stack>
          ) : (
            <Stack direction={"row"} flex={true} alignItems={"center"} mt={1}>
              <CheckIcon />
              <Text fontSize="lg" color="green.600">
                <b>Assignment completed!</b>
              </Text>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AssignmentItem;

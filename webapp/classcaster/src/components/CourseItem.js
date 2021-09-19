import React from "react";
import {
  Badge,
  LinkBox,
  Box,
  Text,
  LinkOverlay,
  useColorModeValue,
} from "@chakra-ui/react";

/**
 * CourseItem is a component for each individual course, which
 * will be a pop up element on Course Directory page).
 */

export default function CourseItem(props) {
  return (
    <Box py={2}>
      <LinkBox
        height={"11rem"}
        maxW={"100%"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
      >
        <LinkOverlay
          href="/course/5b533b0b-7182-4724-b87c-8e454c442bd5"
          maxWidth={"100%"}
        >
          <Badge
            borderRadius="full"
            px="2"
            colorScheme="blue"
            fontSize="m"
            p={".1rem 1.5rem .1rem 1.5rem"}
          >
            {props.courseNum}
          </Badge>
          <Text fontSize={"xl"} fontFamily={"body"} px={3} py={5}>
            {props.courseName}
          </Text>
          <Text
            textAlign={"center"}
            color={useColorModeValue("gray.700", "gray.400")}
            px={3}
          ></Text>
        </LinkOverlay>
      </LinkBox>
    </Box>
  );
}

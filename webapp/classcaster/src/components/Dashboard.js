import React, { useState, useEffect } from "react";
import {
  Badge,
  Center,
  List,
  ListItem,
  Grid,
  GridItem,
  Text,
  Heading,
  Square,
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  Spinner,
  VStack,
  useBreakpointValue,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChatIcon, AddIcon } from "@chakra-ui/icons";
import { MdBuild } from "react-icons/md";
import CourseItem from "./CourseItem";
import StudentCard from "./StudentCard";
import axios from "axios";

const GroupRec = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  useEffect(() => {
    if (!isLoading) return;
    (async () => {
      const res = await axios({
        method: "POST",
        url: "/api",
        data: {
          type: "runAzurePredictions",
        },
      });
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          setStudentList(res.data);
        }, 170);
      }, 50);
    })();
  }, [isLoading]);

  const initialRef = React.useRef();
  const finalRef = React.useRef();
  return (
    <Box>
      <Button
        leftIcon={<ChatIcon />}
        colorScheme="orange"
        variant="outline"
        minW="8rem"
        mt={3}
        onClick={onOpen}
      >
        Group Recommendation
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <form method="POST" action="/login/password">
            <ModalHeader>Your Study Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Center>
                {isLoading ? (
                  <Spinner color="red.500" />
                ) : (
                  <VStack>
                    {studentList.map((item) => (
                      <StudentCard {...item} />
                    ))}
                  </VStack>
                )}
              </Center>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const Dashboard = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const finalRef = React.useRef();

  return (
    <Grid
      h="100vh"
      templateRows="repeat(7, 1fr)"
      templateColumns="repeat(8, 1fr)"
      gap={4}
      p={3}
    >
      <GridItem rowSpan={7} colSpan={2}>
        <Heading
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          margin={"4rem 0 0 1rem"}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: useBreakpointValue({ base: "20%", md: "30%" }),
              position: "absolute",
              bottom: 0,
              left: 3,
              bg: "blue.200",
              zIndex: -1,
            }}
          >
            Dashboard
          </Text>
        </Heading>

        <Box m={5} w="100%">
          <Button
            leftIcon={<MdBuild />}
            colorScheme="blue"
            variant="outline"
            minW="8rem"
            onClick={onOpen}
          >
            Edit Profile
          </Button>
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <form method="POST" action="/login/password">
                <ModalHeader>Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Age</FormLabel>
                    <Input
                      ref={initialRef}
                      name="age"
                      type="number"
                      placeholder="21"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel mt={3}>Race</FormLabel>
                    <Select placeholder="Select option">
                      <option value="option1">
                        American Indian or Alaskan Native
                      </option>
                      <option value="option2">Asian</option>
                      <option value="option3">Black or African American</option>
                      <option value="option4">Hispanic or Latino</option>
                      <option value="option5">White</option>
                      <option value="option6">
                        Native Hawaiian or Other Pacific Islander
                      </option>
                      <option value="option7">
                        Other / Decline to identify
                      </option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel mt={3}>Gender</FormLabel>
                    <Select placeholder="Select option">
                      <option value="option1">Male</option>
                      <option value="option2">Female</option>
                      <option value="option3">Neither</option>
                      <option value="option4">Prefer not to answer</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel mt={3}>
                      Number of upper division courses taken
                    </FormLabel>
                    <Input name="upperdiv" placeholder="0" />
                  </FormControl>

                  <FormControl>
                    <FormLabel mt={3}>
                      Number of lower division courses taken
                    </FormLabel>
                    <Input name="lowerdiv" placeholder="0" />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button type="submit" colorScheme="blue" mr={3}>
                    Save
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <GroupRec />

          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            variant="outline"
            minW="8rem"
            mt={3}
          >
            Record Progress
          </Button>
        </Box>
      </GridItem>
      <GridItem rowSpan={2} colSpan={6}>
        <Box
          role={"group"}
          p={6}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
          zIndex={1}
        >
          <Grid
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(5, 1fr)"
            p={3}
            gap={4}
            height={"100%"}
          >
            <GridItem rowSpan={1} colSpan={1} p={5}>
              <Square h={"100%"} w="100%">
                <Heading fontSize={"6xl"}>15</Heading>
                <Box as="span" color="gray.600" fontSize="lg" pl={3}>
                  hrs
                </Box>
              </Square>
              <Text color="gray.400" pl={3}>
                estimate time of completion
              </Text>
            </GridItem>
            <GridItem rowSpan={1} colSpan={4} m={2}>
              <Center>
                <List spacing={3}>
                  <ListItem>
                    <Badge
                      borderRadius="full"
                      m="2"
                      px="3"
                      colorScheme="orange"
                      fontSize="m"
                      size="sm"
                    >
                      CS189
                    </Badge>
                    <Text as="span" fontSize="lg" ml="9">
                      Homework 2 should take you <b>8 hours</b>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Badge
                      borderRadius="full"
                      m="2"
                      px="3"
                      colorScheme="orange"
                      fontSize="m"
                      size="sm"
                    >
                      EECS16B
                    </Badge>
                    <Text as="span" fontSize="lg" ml="4">
                      Lab 2: Transistors should take you <b>3 hours</b>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Badge
                      borderRadius="full"
                      m="2"
                      px="3"
                      colorScheme="orange"
                      fontSize="m"
                      size="sm"
                    >
                      EECS16B
                    </Badge>
                    <Text as="span" fontSize="lg" ml="4">
                      Homework 1: 16A Review should take you <b>4 hours</b>
                    </Text>
                  </ListItem>
                </List>
              </Center>
            </GridItem>
          </Grid>
        </Box>
      </GridItem>
      <GridItem rowSpan={5} colSpan={6}>
        <Grid
          templateRows="repeat(4, 1fr)"
          templateColumns="repeat(3, 1fr)"
          p={3}
          mt={9}
          gap={4}
          height={"100%"}
        >
          {
            <GridItem rowSpan={1} colSpan={1}>
              <CourseItem
                courseNum={"EECS16B"}
                courseName={"Designing Information Devices and Systems II"}
              />
            </GridItem>
          }
          <GridItem rowSpan={1} colSpan={1}>
            <CourseItem
              courseNum={"CS189"}
              courseName={"Intro to Machine Learning"}
            />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <CourseItem
              courseNum={"CS194"}
              courseName={"Intro to Parallel Computing"}
            />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <CourseItem
              courseNum={"CS 198-177"}
              courseName={"Algorithmic Thinking"}
            />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default Dashboard;

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import Logo from "../components/widgets/Logo";
import { useAuth } from "../providers/AuthProvider";
import { routeLinks } from "../routes";

const HomePage = () => {
  const { userData, loading} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if(!loading && userData) {
      navigate(routeLinks.dashboard);
    }
  }, [userData])

  return (
    <Box>
      {/* Top Nav */}
      <Flex
        justify="space-between"
        align="center"
        px={8}
        py={4}
        borderBottom="1px solid"
        borderColor={{ base: "gray.200", _dark: "gray.600" }}
        bg={{ base: "white", _dark: "gray.800" }}
      >
        <Logo />
        <Link to="/signin">
          <Button variant="ghost" colorScheme="brand">
            Sign In
          </Button>
        </Link>
      </Flex>

      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        textAlign="center"
        py={20}
        px={4}
        bg={{ base: "gray.50", _dark: "gray.700" }}
      >
        <Heading fontSize="4xl" mb={4}>
          Find Trusted Technicians Near You
        </Heading>
        <Text maxW="600px" mb={6}>
          QuickConnect helps clients and technicians connect quickly and securely.
        </Text>
        <HStack spacing={4}>
          <Link to="/signup/client">
            <Button size="lg" colorScheme="brand">
              Join as Client
            </Button>
          </Link>
          <Link to="/signup/technician">
            <Button size="lg" variant="outline" colorScheme="brand">
              Offer Services
            </Button>
          </Link>
        </HStack>
      </Flex>

      {/* How It Works */}
      <Box py={16} px={4} bg={{ base: "white", _dark: "gray.800" }}>
        <Heading textAlign="center" mb={10}>
          How It Works
        </Heading>
        <Flex justify="center" gap={12} wrap="wrap">
          {["Create an Account", "Find or Accept Jobs", "Chat & Get Paid"].map(
            (step, i) => (
              <VStack key={i} w="250px" textAlign="center" spacing={4}>
                <Box
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg="brand.500"
                  color="white"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="lg"
                >
                  {i + 1}
                </Box>
                <Text fontWeight="semibold">{step}</Text>
              </VStack>
            )
          )}
        </Flex>
      </Box>

      {/* Role Info */}
      <Box py={16} px={4} bg={{ base: "gray.100", _dark: "gray.600" }}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={12}
          maxW="6xl"
          mx="auto"
          textAlign="center"
        >
          <Box flex="1">
            <Heading size="md" mb={2}>
              👤 For Clients
            </Heading>
            <Text>- Browse verified technicians</Text>
            <Text>- Request jobs easily</Text>
            <Text>- Pay securely</Text>
          </Box>
          <Box flex="1">
            <Heading size="md" mb={2}>
              🛠 For Technicians
            </Heading>
            <Text>- Create your service profile</Text>
            <Text>- Get jobs nearby</Text>
            <Text>- Get paid after completion</Text>
          </Box>
        </Stack>
      </Box>

      {/* Footer */}
      <Flex
        justify="center"
        align="center"
        py={6}
        bg={{ base: "gray.800", _dark: "gray.900" }}
        color={{ base: "whiteAlpha.900", _dark: "whiteAlpha.700" }}
      >
        <Text fontSize="sm">
          © {new Date().getFullYear()} QuickConnect. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default HomePage;

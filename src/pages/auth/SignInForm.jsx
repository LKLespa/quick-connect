import React from "react";
import {
  Box,
  Input,
  Stack,
  Field,
  Fieldset,
  Button,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form, Field as FormikField } from "formik";
import { Link, useNavigate } from "react-router";
import { routeLinks } from "../../routes";
import Logo from "../../components/widgets/Logo";
// import { useAuth } from "../../provider/AuthProvider";

// 🔐 Yup Validation Schema
const SignInSchema = Yup.object().shape({
  email: Yup.string().trim().required("Email is required").email("Invalid email address"),
  password: Yup.string().trim().required("Password is required"),
});

const SignInForm = () => {

  // const { signIn, loading } = useAuth();
  let loading = false;
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    console.log("Handle Submit", values)
    // signIn({
    //   email: values.email,
    //   password: values.password,
    //   onDone: () => navigate(pathLinks.home)
    // })
  }

  return (
    <Box as={Flex} alignItems='center' w='100vw' h='100vh' py={{ base: 0, md: 10 }} maxW={1200} justifyContent='space-evenly'
      mx="auto"
      bg="gray.500/20"
      borderRadius="xl"
      flexWrap='wrap'
    >
      <Stack spacing={4} alignItems='center'>
        <Logo />
        <Text fontSize="2xl" fontWeight="bold">
          Welcome Back
        </Text>
        <Text>
          Please provide your login Credentials.
        </Text>
      </Stack>
      <Box
        p={{ base: 6, md: 8 }}
        maxW="lg"
        w='full'
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Fieldset.Root size="lg" spacing={2}>

                <VStack spacing={4} mt={6}>
                  {/* Email */}
                  <Fieldset.Content w="full">
                    <Field.Root invalid={!!errors.email && touched.email}>
                      <Field.Label>Email Address</Field.Label>
                      <FormikField
                        as={Input}
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                      />
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Password */}
                  <Fieldset.Content w="full">
                    <Field.Root invalid={!!errors.password && touched.password}>
                      <Field.Label>Password</Field.Label>
                      <FormikField
                        as={Input}
                        name="password"
                        type="password"
                        placeholder="••••••••"
                      />
                      <Field.ErrorText>{errors.password}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  <Button type="submit" size="lg" w="full" mt={4} loading={loading}>
                    Sign In
                  </Button>

                  <Link to={routeLinks.signUp}>
                    <Text fontSize="sm" textAlign="center">
                      Don't have an account?
                      Sign Up
                    </Text>
                  </Link>
                </VStack>
              </Fieldset.Root>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SignInForm;

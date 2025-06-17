import React, { useRef, useState } from "react";
import {
  Box,
  Input,
  Stack,
  Field,
  Fieldset,
  Button,
  Text,
  VStack,
  ToggleRoot,
  HStack,
  Flex,
  Avatar,
} from "@chakra-ui/react";

import * as Yup from "yup";
import { Form, Formik, Field as FormikField, validateYupSchema } from "formik";
import { routeLinks } from "../../routes";
import { useNavigate, Link, useParams } from "react-router";
import Logo from "../../components/widgets/Logo";
import { UserPhoto } from "../../assets";
import { useAuth } from "../../providers/AuthProvider";
// import { useAuth } from "../../provider/AuthProvider";

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().trim().required("Full Name is required"),
  email: Yup.string().trim().required("Email is required").email("Invalid Email Address"),
  phone: Yup.string().trim().matches(/^\d{9,12}$/, "Phone number must be between 9 and 12 digits"),
  password: Yup.string().trim().required("Password is required").min(8, "Password must be at least 8 characters").max(25, "Password is must be less than 25 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.string().oneOf(["client", "technician"], 'Please select one of the 2 roles').required("Role is required"),
})

const SignUpForm = () => {
  const { loading, error, signUp } = useAuth()
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profileError, setProfileError] = useState('');
  const maxFileSize = 3 * 1024 * 1024; // 3MB
  const imageInputRef = useRef();

  const params = useParams();
  console.log('Params', params)

  const handleSubmit = async (values) => {

    console.log('Handle Submit', values, profileImage)

    try {
      await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phone,
        role: values.role,
        photo: profileImage,
        onDone: () => navigate(routeLinks.dashboard)
      })
    } catch (err) {
      alert('An Error Occured')
    }
  }

  return (
    <Box as={Flex} alignItems='center' w='100vw' h='100vh' py={{ base: 0, md: 10 }} maxW={1200} justifyContent='space-evenly'
      mx="auto"
      bg="gray.500/20"
      borderRadius="xl"
      flexWrap='wrap'
      overflow='auto'
    >
      <Stack spacing={4} alignItems='center'>
        <Logo />
        <Text fontSize="2xl" fontWeight="bold">
          Create Your Account
        </Text>
        <Text>
          Please provide your information.
        </Text>
        <Fieldset.Root>
          <Fieldset.Content w="full">
            <Field.Root invalid={profileError}>
              <Field.Label>Profile Photo (Optional)</Field.Label>

              <Input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                display='none'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  if (file.size > maxFileSize) {
                    setProfileError("File size should not exceed 3MB.");
                    return;
                  }

                  setProfileImage(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }}
              />

              <Avatar.Root onClick={() => imageInputRef.current.click()} shape='full' width={200} height={200}>
                <Avatar.Image src={previewUrl ?? UserPhoto} alt='Preview' />
              </Avatar.Root>
              <Field.ErrorText>{profileError}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>

      </Stack>
      <Box
        p={{ base: 6, md: 8 }}
        maxW="lg"
      >
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: params?.role ?? "",
          }}

          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) =>
            <Form>
              <Fieldset.Root size='lg' spacing={2}>
                <Fieldset.Content w="full">
                  <Field.Root invalid={errors.role && touched.role}>
                    <VStack w="full">
                      <Field.Label textAlign='left' w='full'>How would you like to use QuickConnect?</Field.Label>
                      <Flex flexWrap='wrap' gap={2}>
                        <Button
                          variant={values.role === "client" ? "solid" : "outline"}
                          flexGrow={1}
                          w={200}
                          h={100}
                          textWrap='wrap'
                          onClick={() => setFieldValue("role", "client")}
                        >
                          <VStack gap={2}>
                            <Text fontSize='lg'>Continue as a Client</Text>
                            <Text>Find Technicians</Text>
                          </VStack>
                        </Button>
                        <Button
                          // as={Button}
                          variant={values.role === "technician" ? "solid" : "outline"}
                          flexGrow={1}
                          w={200}
                          h={100}
                          textWrap='wrap'
                          onClick={() => setFieldValue("role", "technician")}
                        >
                          <VStack gap={2}>
                            <Text fontSize='lg'>Continue as a Technician</Text>
                            <Text>Offer Your Services</Text>
                          </VStack>
                        </Button>
                      </Flex>
                    </VStack>
                    {errors.role && touched.role && (
                      <Field.ErrorText>{errors.role}</Field.ErrorText>
                    )}
                  </Field.Root>
                </Fieldset.Content>

                {/* ⬇️ move VStack outside of Fieldset.Content */}
                <VStack spacing={4} mt={6}>
                  {/* Full Name */}
                  <Fieldset.Content w="full">
                    <Field.Root invalid={!!errors.fullName && touched.fullName}>
                      <Field.Label>Full Name</Field.Label>
                      <FormikField as={Input} name="fullName" placeholder="John Doe" />
                      <Field.ErrorText>{errors.fullName}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Email */}
                  <Fieldset.Content w="full">
                    <Field.Root invalid={!!errors.email && touched.email}>
                      <Field.Label>Email Address</Field.Label>
                      <FormikField as={Input} name="email" type="email" placeholder="you@example.com" />
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Phone */}
                  <Fieldset.Content w="full">
                    <Field.Root invalid={!!errors.phone && touched.phone}>
                      <Field.Label>Phone Number</Field.Label>
                      <FormikField as={Input} name="phone" type="tel" placeholder="0700000000" />
                      <Field.ErrorText>{errors.phone}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Password */}
                  <Fieldset.Content w="full">
                    <Field.Root invalid={!!errors.password && touched.password}>
                      <Field.Label>Password</Field.Label>
                      <FormikField as={Input} name="password" type="password" placeholder="••••••••" />
                      <Field.ErrorText>{errors.password}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Confirm Password */}
                  <Fieldset.Content w="full">
                    <Field.Root invalid={!!errors.confirmPassword && touched.confirmPassword}>
                      <Field.Label>Confirm Password</Field.Label>
                      <FormikField as={Input} name="confirmPassword" type="password" placeholder="••••••••" />
                      <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  <Button type="submit" size="lg" w="full" mt={4} loading={loading}>
                    Sign Up
                  </Button>

                  <Link to={routeLinks.signIn}>
                    <Text fontSize="sm" textAlign="center">
                      Already have an account? Sign In
                    </Text>
                  </Link>
                </VStack>

              </Fieldset.Root>
            </Form>
          }
        </Formik>
      </Box>
    </Box>
  );
};

export default SignUpForm;

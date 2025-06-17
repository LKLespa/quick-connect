import React, { useState } from "react";
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
  Select,
} from "@chakra-ui/react";

import * as Yup from "yup";
import { Form, Formik, Field as FormikField, validateYupSchema } from "formik";
import { routeLinks } from "../../routes";
import { useNavigate, Link } from "react-router";
import Logo from "../../components/widgets/Logo";
import { fetchAddressFromCoords } from "../../utils/geo-location";
import { countryData } from "../../constants";
import SelectField from "../../components/widgets/SelectField";
// import { useAuth } from "../../provider/AuthProvider";

const TechnicianSetupSchema = Yup.object().shape({
  locationCoordinates: Yup.object().shape({
    latitude: Yup.number().required(),
    longitude: Yup.number().required()
  }).nullable(),

  region: Yup.string()
    .trim()
    .when("locationCoordinates", {
      is: (loc) => !loc,
      then: (schema) => schema.required("Region is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  city: Yup.string()
    .trim()
    .when("locationCoordinates", {
      is: (loc) => !loc,
      then: (schema) => schema.required("City is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  locality: Yup.string()
    .trim()
    .when("locationCoordinates", {
      is: (loc) => !loc,
      then: (schema) => schema.required("Local address is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  mainService: Yup.string()
    .trim()
    .required("Main service is required"),

  yearsOfService: Yup.number()
    .typeError("Must be a number")
    .required("Years of service is required"),

  otherServices: Yup.array().of(Yup.string().trim()).nullable(),
});


const TechnicianSetup = () => {
  // const { loading, error, signUp } = useAuth()
  let loading = false;
  const navigate = useNavigate();
  const [regions, setRegions] = useState(countryData.states);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [cities, setCities] = useState([])

  console.log('Regions', regions)
  const handleSubmit = async (values) => {

    console.log('Handle Submit', values)

    //   signUp({email: values.email,
    // password: values.password,
    // fullName: values.fullName,
    // phoneNumber: values.phone,
    // role: values.role,
    // onDone: () => navigate(pathLinks.home),})
  }

  return (
    <VStack alignItems='center' w='100vw' h='100vh' py={{ base: 0, md: 10 }} maxW={1200} justifyContent='space-evenly'
      mx="auto"
      bg="gray.500/20"
      borderRadius="xl"
      overflow='auto'
    >
      <Stack spacing={4} alignItems='center'>
        <Logo />
        <Text fontSize="xl" fontWeight="bold">
          Setup Your Profile
        </Text>
      </Stack>
      <Box
        p={{ base: 6, md: 8 }}
        maxW="lg"
        w='full'
      >
        <Formik
          initialValues={{
            region: "",
            city: "",
            locality: "",
            mainService: "",
            yearsOfService: "",
            otherServices: [],
            locationCoordinates: null,
          }}
          validationSchema={TechnicianSetupSchema}
          onSubmit={(values) => {
            console.log("Technician Setup Submitted:", values);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form w='full'>
              <VStack spacing={5} align="stretch" w='full'>
                <Fieldset.Root size="lg" spacing={4}>

                  {/* Use Location Button */}
                  <Fieldset.Content>
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      onClick={async () => {
                        navigator.geolocation.getCurrentPosition(
                          async (pos) => {
                            const coords = {
                              latitude: pos.coords.latitude,
                              longitude: pos.coords.longitude,
                            };

                            setFieldValue("locationCoordinates", coords);

                            // Reverse geocode
                            const address = await fetchAddressFromCoords(coords.latitude, coords.longitude);

                            setFieldValue("region", address.region);
                            setFieldValue("city", address.city);
                            setFieldValue("locality", address.locality);
                          },
                          (err) => {
                            console.error("Location error:", err.message);
                            alert("Unable to retrieve location");
                          }
                        );
                      }}

                    >
                      Use My Current Location
                    </Button>
                    {values.locationCoordinates && (
                      <HStack>
                        <Text fontSize="sm" color="green.500">
                          📍 Location detected: ({values.locationCoordinates.latitude.toFixed(4)},{" "}
                          {values.locationCoordinates.longitude.toFixed(4)})
                        </Text>
                        <Button size="xs" variant="ghost" colorScheme="red" onClick={() => setFieldValue("locationCoordinates", null)}>
                          Clear
                        </Button>
                      </HStack>

                    )}


                  </Fieldset.Content>
                  {/* Conditional Region / City / Locality */}
                  <Fieldset.Content>
                    <Field.Root invalid={!!errors.region && touched.region}>
                      <Field.Label>Region</Field.Label>
                      <SelectField label='Region' placeholder='Select Region' value={values.region} onChange={(e) => {
                        const regionName = e.target.value;
                        const region = regions.find(r => r.name === regionName);
                        setSelectedRegion(region);
                        setCities(region ? region.cities : []);
                        setFieldValue("region", regionName);
                        setFieldValue("city", ""); // reset city when region changes
                      }} disabled={!!values.locationCoordinates}>
                        {regions.map((region) => (
                          <option key={region.id} value={region.name}>
                            {region.name}
                          </option>
                        ))}
                      </SelectField>
                      <Field.ErrorText>{errors.region}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                    <Fieldset.Content>
                    <Field.Root invalid={!!errors.city && touched.city}>
                      <Field.Label>City</Field.Label>
                      <SelectField label='City' placeholder='Select City' value={values.city} onChange={(e) => setFieldValue('city', e.target.value)} disabled={!!values.locationCoordinates}>
                        {cities.map((city) => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </SelectField>
                      <Field.ErrorText>{errors.city}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  <Fieldset.Content>
                    <Field.Root invalid={!!errors.locality && touched.locality}>
                      <Field.Label>Local Address</Field.Label>
                      <FormikField as={Input} name="locality" placeholder="Street / Quarter" disabled={values.locationCoordinates} />
                      <Field.ErrorText>{errors.locality}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Main Service */}
                  <Fieldset.Content>
                    <Field.Root invalid={!!errors.mainService && touched.mainService}>
                      <Field.Label>Main Service</Field.Label>
                      <FormikField as={Input} name="mainService" placeholder="e.g. Plumbing" />
                      <Field.ErrorText>{errors.mainService}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Years of Experience */}
                  <Fieldset.Content>
                    <Field.Root invalid={!!errors.yearsOfService && touched.yearsOfService}>
                      <Field.Label>Years of Experience</Field.Label>
                      <FormikField as={Input} name="yearsOfService" type="number" placeholder="e.g. 5" min={0} max={60} />
                      <Field.ErrorText>{errors.yearsOfService}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Other Services */}
                  <Fieldset.Content>
                    <Field.Root>
                      <Field.Label>Other Services (comma-separated)</Field.Label>
                      <FormikField
                        as={Input}
                        name="otherServicesInput"
                        placeholder="e.g. Electrical Repairs, Painting"
                        onChange={(e) => {
                          const val = e.target.value;
                          const list = val
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s.length > 0);
                          setFieldValue("otherServices", list);
                        }}
                      />
                    </Field.Root>
                  </Fieldset.Content>

                  {/* Submit */}
                  <Fieldset.Content>
                    <Button type="submit" colorScheme="blue" w="full">
                      Submit Setup
                    </Button>
                  </Fieldset.Content>
                </Fieldset.Root>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </VStack>
  );
};

export default TechnicianSetup;

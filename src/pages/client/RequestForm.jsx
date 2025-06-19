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
    HStack,
    Switch,
} from "@chakra-ui/react";
import { Formik, Form, Field as FormikField } from "formik";
import * as Yup from "yup";
import { useTechnicians } from "../../providers/TechnicianProvider";

const RequestSchema = Yup.object().shape({
    description: Yup.string()
        .min(10, "Please provide a more detailed request")
        .required("Description is required"),
    scheduledDate: Yup.date()
        .nullable()
        .typeError("Invalid date")
        .min(new Date(), "Pick a future date"),
})

export default function RequestForm({ technician }) {
    const { sendServiceRequest, loading } = useTechnicians();
    const [emmergency, setEmmergency] = useState(false);

    const handleSubmit = async (values, actions) => {
        try {
            await sendServiceRequest({
                technicianId: technician.id,
                technicianName: technician.fullName,
                technicianPhotoUrl: technician.photoUrl,
                emmergency,
                ...values,
            });
            actions.resetForm();
        } catch (error) {
            console.error(error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md" maxW={600} w="full">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Service Request</Text>

            <Formik
                initialValues={{
                    description: '',
                    scheduledDate: '',
                }}
                validationSchema={RequestSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                    <Form>
                        <Fieldset.Root size="lg" spacing={4}>
                            <Fieldset.Content w="full">
                                <Field.Root invalid={!!errors.description && touched.description}>
                                    <Field.Label>Description</Field.Label>
                                    <FormikField as={Input} name="description" placeholder="Describe the issue or request" />
                                    <Field.ErrorText>{errors.description}</Field.ErrorText>
                                </Field.Root>
                            </Fieldset.Content>

                            <Fieldset.Content w="full">
                                <Field.Root invalid={!!errors.scheduledDate && touched.scheduledDate}>
                                    <Field.Label>Preferred Date (Optional)</Field.Label>
                                    <FormikField as={Input} name="scheduledDate" type="date" />
                                    <Field.ErrorText>{errors.scheduledDate}</Field.ErrorText>
                                </Field.Root>
                            </Fieldset.Content>

                            {/* Emergency Switch */}
                            <Switch.Root checked={emmergency} onCheckedChange={(e) => setEmmergency(prev => !prev)}>
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label>Emmergency</Switch.Label>
                            </Switch.Root>

                            <Button
                                type="submit"
                                colorScheme="teal"
                                size="lg"
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                                loading={loading}
                                loadingText='Submitting'
                            >
                                Submit Request
                            </Button>
                        </Fieldset.Root>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

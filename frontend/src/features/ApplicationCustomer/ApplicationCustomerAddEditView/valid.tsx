import * as yup from "yup";

export const schema = yup.object().shape({
  
  director: yup.string(),
  okpo: yup.string(),
  paymentAccount: yup.string(),
  postalCode: yup.string(),
  ugns: yup.string(),
  bank: yup.string(),
  bik: yup.string(),
  registrationNumber: yup.string(),
  identityDocumentTypeId: yup.number().notOneOf([0], "Required field").required("Required field"),
  organizationTypeId: yup.number().notOneOf([0], "Required field").required("Required field"),
  pin: yup.string(),
  applicationId: yup.number().notOneOf([0], "Required field").required("Required field"),
  isOrganization: yup.boolean().nullable().default(false),
  fullName: yup.string(),
  address: yup.string(),
});

export const validateField = async (name: string, value: any) => {
  try {
    const schemas = yup.object().shape({
      [name]: schema.fields[name],
    });
    await schemas.validate({ [name]: value }, { abortEarly: false });
    return { isValid: true, error: "" };
  } catch (validationError) {
    return { isValid: false, error: validationError.errors[0] };
  }
};

export const validate = async (data: any) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (validationErrors) {
    let errors: any = {};
    validationErrors.inner.forEach((error: any) => {
      errors[error.path] = error.message;
    });
    return { isValid: false, errors };
  }
};

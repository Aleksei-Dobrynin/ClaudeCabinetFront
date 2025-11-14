import * as yup from "yup";

export const schema = yup.object().shape({
  
  workDescription: yup.string(),
  archObjectId: yup.number().notOneOf([0], "Required field").required("Required field"),
  statusId: yup.number().notOneOf([0], "Required field").required("Required field"),
  companyId: yup.number().notOneOf([0], "Required field").required("Required field"),
  rServiceId: yup.number().notOneOf([0], "Required field").required("Required field"),
  rServiceName: yup.string(),
  uniqueCode: yup.string(),
  registrationDate: yup
    .date()
    .nullable()
    .required("Required field")
    .typeError("Please provide a valid date"),
  deadline: yup
    .date()
    .nullable()
    .required("Required field")
    .typeError("Please provide a valid date"),
  number: yup.string(),
  comment: yup.string(),
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

import * as yup from "yup";
import i18n from "i18next";

export const schema = yup.object().shape({
  
  pin: yup.string().required(i18n.t("label:CustomerAddEditView.validation.required")),
  // organizationTypeId: yup.number().notOneOf([0], i18n.t("label:CustomerAddEditView.validation.required")).required(i18n.t("label:CustomerAddEditView.validation.required")),
  name: yup.string().required(i18n.t("label:CustomerAddEditView.validation.required")),
  identity_document_type_id: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === undefined ? null : Number(originalValue)
    )
    .required(i18n.t("label:CustomerAddEditView.validation.required"))
    .moreThan(0, i18n.t("label:CustomerAddEditView.validation.required")),
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
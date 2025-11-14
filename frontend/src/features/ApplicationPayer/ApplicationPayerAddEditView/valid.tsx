import * as yup from "yup";
import i18n from "i18next";

export const schema = yup.object().shape({
  fullName: yup
    .string()
    .test('len', i18n.t('label:ApplicationPayerAddEditView.validation.fullNameMaxLength'), val => !val || val.length <= 50),
  address: yup
    .string()
    .test('len', i18n.t('label:ApplicationPayerAddEditView.validation.addressMaxLength'), val => !val || val.length <= 50),
  pin: yup
    .string()
    .test("pin-format", i18n.t('label:ApplicationPayerAddEditView.validation.pinFormat'), (value, context) => {
      const { parent } = context;
      if (!parent.isForeign) {
        return /^[0-9]{14}$/.test(value || "");
      }
      return true;
    })
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
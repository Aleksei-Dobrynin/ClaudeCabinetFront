import * as yup from "yup";
import i18n from "i18next";

export const schema = yup.object().shape({
  okpo: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.okpoMaxLength'), val => !val || val.length <= 50),
  postalCode: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.postalCodeMaxLength'), val => !val || val.length <= 6),
  ugns: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.ugnsMaxLength'), val => !val || val.length <= 50),
  regNumber: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.regNumberMaxLength'), val => !val || val.length <= 50),
  typeOrganizationId: yup.number().notOneOf([0], i18n.t('label:PayerAddEditView.validation.typeOrganizationIdRequired')).required(i18n.t('label:PayerAddEditView.validation.typeOrganizationIdRequired')),
  lastName: yup.string().required(i18n.t('label:PayerAddEditView.validation.lastNameRequired')).test('len', i18n.t('label:PayerAddEditView.validation.lastNameMaxLength'), val => !val || val.length <= 50)
    .matches(
      /^[A-Za-zА-Яа-яЁё\s\-']*$/,
      i18n.t('label:PayerAddEditView.validation.nameFormat')
    ),
  firstName: yup.string().required(i18n.t('label:PayerAddEditView.validation.firstNameRequired')).test('len', i18n.t('label:PayerAddEditView.validation.firstNameMaxLength'), val => !val || val.length <= 50)
    .matches(
      /^[A-Za-zА-Яа-яЁё\s\-']*$/,
      i18n.t('label:PayerAddEditView.validation.nameFormat')
    ),
  secondName: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.secondNameMaxLength'), val => !val || val.length <= 50)
    .matches(
      /^[A-Za-zА-Яа-яЁё\s\-']*$/,
      i18n.t('label:PayerAddEditView.validation.nameFormat')
    ),
  fullName: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.fullNameMaxLength'), val => !val || val.length <= 50)
    .matches(
      /^[A-Za-zА-Яа-яЁё\s\-']*$/,
      i18n.t('label:PayerAddEditView.validation.nameFormat')
    ),
  address: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.addressMaxLength'), val => !val || val.length <= 50),
  director: yup.string().test('len', i18n.t('label:PayerAddEditView.validation.directorMaxLength'), val => !val || val.length <= 50),
  pin: yup
    .string()
    .test("pin-format", i18n.t('label:PayerAddEditView.validation.pinFormat'), (value, context) => {
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
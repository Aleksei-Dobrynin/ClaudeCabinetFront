import * as yup from "yup";
import i18n from "i18next";

export const schema = yup.object().shape({

  firstName: yup.string().required(i18n.t("message:error.fieldRequired")).test('len', i18n.t("label:RepresentativeAddEditView.validation.firstNameMaxLength"), val => !val || val.length <= 50)
    .matches(
      /^[A-Za-zА-Яа-яЁё\s\-']*$/,
      i18n.t("label:RepresentativeAddEditView.validation.nameFormat")
    ),
  secondName: yup.string().test('len', i18n.t("label:RepresentativeAddEditView.validation.secondNameMaxLength"), val => !val || val.length <= 50)
    .matches(
      /^[A-Za-zА-Яа-яЁё\s\-']*$/,
      i18n.t("label:RepresentativeAddEditView.validation.nameFormat")
    ),
  pin: yup
    .string()
    .required(i18n.t("message:error.fieldRequired"))
    .test("pin-format", i18n.t("message:error.pinLength"), (value, context) => {
      const { parent } = context;
      if (!parent.isForeign) {
        return /^[0-9]{14}$/.test(value || "");
      }
      return true;
    }),
  companyId: yup.number().notOneOf([0], i18n.t("message:error.fieldRequired")).required(i18n.t("message:error.fieldRequired")),
  hasAccess: yup.boolean().nullable().default(false),
  typeId: yup.number().notOneOf([0], i18n.t("message:error.fieldRequired")).required(i18n.t("message:error.fieldRequired")),
  email: yup.string().email(i18n.t("label:RepresentativeAddEditView.validation.emailFormat")).required(i18n.t("message:error.fieldRequired")),
  lastName: yup.string().required(i18n.t("message:error.fieldRequired")).test('len', i18n.t("label:RepresentativeAddEditView.validation.lastNameMaxLength"), val => !val || val.length <= 50)
    .matches(
      /^[A-Za-zА-Яа-яЁё\s\-']*$/,
      i18n.t("label:RepresentativeAddEditView.validation.nameFormat")
    )
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
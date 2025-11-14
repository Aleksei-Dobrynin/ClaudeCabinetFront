import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Box,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import CustomerRequestionFastInputView from 'features/CustomerRequisite/CustomerRequisiteAddEditView/fastInput'
import { CustomerRequisite } from "constants/CustomerRequisite";
import { APPLICATION_CABINET_STATUSES } from "constants/constant";
import CustomButton from "components/Button";
import MainStore from "MainStore";
import PhoneInputWithCountry from 'components/PhoneField';
import { DEFAULT_COUNTRIES } from 'constants/countrieCodes';
import SearchIcon from '@mui/icons-material/Search';
import MaskedTextField from "components/MaskedTextField";
import DateField from "components/DateField";

type CustomerTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseCustomerView: FC<CustomerTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <form data-testid="CustomerForm" id="CustomerForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <Box display={"flex"} justifyContent={"space-between"}>
                  <span id="Customer_TitleName">
                    {translate('label:UserProfile.personalInfo')}
                  </span>
                </Box>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  {store.isPhysical ? <>
                      <Grid item md={4} xs={12}>
                        <CustomTextField
                          value={store.lastName}
                          onChange={(event) => store.handleChange(event)}
                          name="lastName"
                          id="id_f_Customer_lastName"
                          label={translate('label:CustomerAddEditView.lastName')}
                          helperText={store.errors.lastName}
                          error={!!store.errors.lastName}
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <CustomTextField
                          value={store.firstName}
                          onChange={(event) => store.handleChange(event)}
                          name="firstName"
                          id="id_f_Customer_firstName"
                          label={translate('label:CustomerAddEditView.firstName')}
                          helperText={store.errors.firstName}
                          error={!!store.errors.firstName}
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <CustomTextField
                          value={store.secondName}
                          onChange={(event) => store.handleChange(event)}
                          name="secondName"
                          id="id_f_Customer_secondName"
                          label={translate('label:CustomerAddEditView.secondName')}
                          helperText={store.errors.secondName}
                          error={!!store.errors.secondName}
                        />
                      </Grid>
                    </> :
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_Customer_name"
                      id='id_f_Customer_name'
                      label={translate('label:CustomerAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>}
                  {!store.isPhysical &&
                    <Grid item md={6} xs={12}>
                      <LookUp
                        value={store.organizationTypeId}
                        onChange={(event) => store.handleChange(event)}
                        name="organizationTypeId"
                        data={store.organizationTypes}
                        id='id_f_Customer_organizationTypeId'
                        label={translate('label:CustomerAddEditView.organizationTypeId')}
                        helperText={store.errors.organizationTypeId}
                        error={!!store.errors.organizationTypeId}
                      />
                    </Grid>
                  }
                  <Grid item md={5} xs={11}>
                    <MaskedTextField
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_Customer_pin"
                      id='id_f_Customer_pin'
                      label={translate('label:CustomerAddEditView.pin')}
                      helperText={store.errors.pin}
                      mask={"00000000000000"}
                      error={!!store.errors.pin}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_Customer_address"
                      id='id_f_Customer_address'
                      label={translate('label:CustomerAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <LookUp
                      value={store.identity_document_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="identity_document_type_id"
                      data={store.Identity_document_types}
                      id="id_f_Customer_identity_document_type_id"
                      label={translate("label:CustomerAddEditView.identity_document_type_id")}
                      helperText={store.errors.identity_document_type_id}
                      error={!!store.errors.identity_document_type_id}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.passport_series}
                      onChange={(event) => store.handleChange(event)}
                      name="passport_series"
                      data-testid="id_f_Customer_passport_series"
                      id='id_f_Customer_passport_series'
                      label={translate('label:CustomerAddEditView.passport_series')}
                      helperText={store.errors.passport_series}
                      error={!!store.errors.passport_series}
                      sx={
                        (MainStore.showProfileField && store.passport_series == null)
                          ? {
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#1d1d86',
                                borderWidth: '2px',
                              },
                              '&:hover fieldset': {
                                borderColor: '#1d1d86',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1d1d86',
                              },
                            }
                          }
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DateField
                      value={store.passport_issued_date}
                      onChange={(event) => store.handleChange(event)}
                      name="passport_issued_date"
                      data-testid="id_f_Customer_passport_issued_date"
                      id='id_f_Customer_passport_issued_date'
                      label={translate('label:CustomerAddEditView.passport_issued_date')}
                      helperText={store.errors.passport_issued_date}
                      error={!!store.errors.passport_issued_date}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.passport_whom_issued}
                      onChange={(event) => store.handleChange(event)}
                      name="passport_whom_issued"
                      data-testid="id_f_Customer_passport_whom_issued"
                      id='id_f_Customer_passport_whom_issued'
                      label={translate('label:CustomerAddEditView.passport_whom_issued')}
                      helperText={store.errors.passport_whom_issued}
                      error={!!store.errors.passport_whom_issued}
                      sx={
                        (MainStore.showProfileField && store.passport_whom_issued == null)
                          ? {
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#1d1d86',
                                borderWidth: '2px',
                              },
                              '&:hover fieldset': {
                                borderColor: '#1d1d86',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1d1d86',
                              },
                            }
                          }
                          : undefined
                      }
                    />
                  </Grid>
                  {!store.isPhysical &&
                    <>
                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          value={store.director}
                          onChange={(event) => store.handleChange(event)}
                          name="director"
                          data-testid="id_f_Customer_director"
                          id='id_f_Customer_director'
                          label={translate('label:CustomerAddEditView.director')}
                          helperText={store.errors.director}
                          error={!!store.errors.director}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          value={store.okpo}
                          onChange={(event) => store.handleChange(event)}
                          name="okpo"
                          data-testid="id_f_Customer_okpo"
                          id='id_f_Customer_okpo'
                          label={translate('label:CustomerAddEditView.okpo')}
                          helperText={store.errors.okpo}
                          error={!!store.errors.okpo}
                        />
                      </Grid>
                    </>
                  }
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.postalCode}
                      onChange={(event) => store.handleChange(event)}
                      name="postalCode"
                      data-testid="id_f_Customer_postalCode"
                      id='id_f_Customer_postalCode'
                      label={translate('label:CustomerAddEditView.postalCode')}
                      helperText={store.errors.postalCode}
                      error={!!store.errors.postalCode}
                    />
                  </Grid>

                  {!store.isPhysical &&
                    <Grid item md={6} xs={12}>
                      <CustomTextField
                        value={store.ugns}
                        onChange={(event) => store.handleChange(event)}
                        name="ugns"
                        data-testid="id_f_Customer_ugns"
                        id='id_f_Customer_ugns'
                        label={translate('label:CustomerAddEditView.ugns')}
                        helperText={store.errors.ugns}
                        error={!!store.errors.ugns}
                      />
                    </Grid>
                  }
                  {!store.isPhysical &&
                    <Grid item md={6} xs={12}>
                      <CustomTextField
                        value={store.regNumber}
                        onChange={(event) => store.handleChange(event)}
                        name="regNumber"
                        data-testid="id_f_Customer_regNumber"
                        id='id_f_Customer_regNumber'
                        label={translate('label:CustomerAddEditView.regNumber')}
                        helperText={store.errors.regNumber}
                        error={!!store.errors.regNumber}
                      />
                    </Grid>
                  }
                  <Grid item md={6} xs={12}>
                    <PhoneInputWithCountry
                      value={store.phone1}
                      onChange={(value, country) => store.handlePhoneChange('phone1', value, country)}
                      // disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration}
                      error={!!store.errors.phone1}
                      helperText={store.errors.phone1}
                      id='id_f_Customer_phone1'
                      label={translate('label:CustomerAddEditView.phone1')}
                      // countries={store.Countries} 
                      defaultCountryId="kg" 
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <PhoneInputWithCountry
                      value={store.phone2}
                      onChange={(value, country) => store.handlePhoneChange('phone2', value, country)}
                      // disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration}
                      error={!!store.errors.phone2}
                      helperText={store.errors.phone2}
                      id='id_f_Customer_phone2'
                      label={translate('label:CustomerAddEditView.phone2')}
                      defaultCountryId="kg"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.email}
                      onChange={(event) => store.handleChange(event)}
                      name="email"
                      data-testid="id_f_Customer_email"
                      id='id_f_Customer_email'
                      label={translate('label:CustomerAddEditView.email')}
                      helperText={store.errors.email}
                      error={!!store.errors.email}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.email_2}
                      onChange={(event) => store.handleChange(event)}
                      name="email_2"
                      data-testid="id_f_Customer_email_2"
                      id='id_f_Customer_email_2'
                      label={translate('label:CustomerAddEditView.email_2')}
                      helperText={store.errors.email_2}
                      error={!!store.errors.email_2}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomCheckbox
                      value={store.allowNotification}
                      onChange={(event) => store.handleChange(event)}
                      name="allowNotification"
                      data-testid="id_f_Customer_allowNotification"
                      id='id_f_Customer_allowNotification'
                      label={translate('label:CustomerAddEditView.allowNotification')}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>

                    <CustomerRequestionFastInputView disabled={MainStore.isCommonCabinet} data={store.requisits} setData={(data: CustomerRequisite[]) => {
                      store.dataChanged = true;
                      store.requisits = data
                    }} />
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
      {props.children}
    </Container>
  );
})

export default BaseCustomerView;
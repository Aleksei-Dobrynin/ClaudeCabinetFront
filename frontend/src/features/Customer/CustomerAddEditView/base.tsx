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
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import MaskedTextField from "components/MaskedTextField";
import CustomerRequestionFastInputView from 'features/CustomerRequisite/CustomerRequisiteAddEditView/fastInput'
import { CustomerRequisite } from "constants/CustomerRequisite";
import { APPLICATION_CABINET_STATUSES } from "constants/constant";
import MainStore from "MainStore";
import AutocompleteCustomImg from "components/AutocompleteWithImg";
import PhoneInputWithCountry from 'components/PhoneField';
import { DEFAULT_COUNTRIES } from 'constants/countrieCodes';
import CustomButton from "../../../components/Button";
import SearchIcon from '@mui/icons-material/Search';
import DateField from "../../../components/DateField";

type CustomerTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  statusCode?: string;
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
                    {translate('label:CustomerAddEditView.entityTitle')}
                  </span>
                  {(store.id === 0 && MainStore.currentUser?.companyId) ? <CustomButton onClick={() => store.setMyCompany(MainStore.currentUser?.companyId)}>
                    {translate('label:CustomerAddEditView.imTheCustomer')}
                  </CustomButton> : <></>}
                </Box>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      data-testid="id_f_Customer_name"
                      id='id_f_Customer_name'
                      label={translate('label:CustomerAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  {!store.isPhysical &&
                    <Grid item md={12} xs={12}>
                      <LookUp
                        value={store.organizationTypeId}
                        onChange={(event) => store.handleChange(event)}
                        name="organizationTypeId"
                        disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
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
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      data-testid="id_f_Customer_pin"
                      id='id_f_Customer_pin'
                      label={translate('label:CustomerAddEditView.pin')}
                      helperText={store.errors.pin}
                      mask={store.is_foreign ? null : "00000000000000"}
                      error={!!store.errors.pin}
                    />
                  </Grid>
                  <Grid item md={1} xs={1}>
                    <IconButton
                      onClick={() => store.searchInfoByPin()}
                    >
                      <SearchIcon />
                    </IconButton>
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
                    />
                  </Grid>

                  {/* <Grid item md={2} xs={12}>

                    {store.is_foreign &&
                      <AutocompleteCustomImg
                        helperText={store.errors.foreign_country}
                        error={!!store.errors.foreign_country}
                        disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                        data={store.Countries}
                        label={translate("common:country")}
                        name={"foreign_country"}
                        value={store.foreign_country}
                        id={"id_f_customer_identity_foreign_country_id"}
                        onChange={(e) => store.handleChange(e)}
                        fieldNameDisplay={(field) => field.name}
                      />
                    }
                  </Grid> */}
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      data-testid="id_f_Customer_address"
                      id='id_f_Customer_address'
                      label={translate('label:CustomerAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomCheckbox
                      value={store.isForeign}
                      onChange={(event) => {
                        store.handleChangeCustomer(event);
                      }}
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      name="isForeign"
                      label={ store.isPhysical ? translate("label:CustomerAddEditView.is_foreign_citezen"): translate("label:CustomerAddEditView.is_foreign_company") }
                      id="id_f_isForeign"
                    />
                  </Grid>
                  {store.isForeign && <Grid item md={6} xs={12}>
                    <AutocompleteCustomImg
                      data={store.Countries}
                      label={translate("common:country")}
                      name={"foreignCountry"}
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}

                      value={store.foreignCountry}
                      id={"id_f_customer_identity_foreign_country_id"}
                      onChange={(e) => store.handleChangeCustomer(e)}
                      fieldNameDisplay={(field) => field.name}
                    />
                  </Grid>}
                  {!store.isPhysical &&
                    <Grid item md={6} xs={12}>
                      <CustomTextField
                        value={store.director}
                        onChange={(event) => store.handleChange(event)}
                        name="director"
                        disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                        data-testid="id_f_Customer_director"
                        id='id_f_Customer_director'
                        label={translate('label:CustomerAddEditView.director')}
                        helperText={store.errors.director}
                        error={!!store.errors.director}
                      />
                    </Grid>}
                  {!store.isPhysical &&
                    <Grid item md={6} xs={12}>
                      <CustomTextField
                        value={store.okpo}
                        onChange={(event) => store.handleChange(event)}
                        name="okpo"
                        disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                        data-testid="id_f_Customer_okpo"
                        id='id_f_Customer_okpo'
                        label={translate('label:CustomerAddEditView.okpo')}
                        helperText={store.errors.okpo}
                        error={!!store.errors.okpo}
                      />
                    </Grid>
                  }
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      value={store.postalCode}
                      onChange={(event) => store.handleChange(event)}
                      name="postalCode"
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
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
                        disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
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
                        disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
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
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
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
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
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
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      helperText={store.errors.email}
                      error={!!store.errors.email}
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

                    <CustomerRequestionFastInputView
                      disabled={props.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || props.statusCode === APPLICATION_CABINET_STATUSES.accepted} data={store.requisits} setData={(data: CustomerRequisite[]) => {
                        store.dataChanged = true;
                        store.requisits = data
                      }} />
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default BaseCustomerView;
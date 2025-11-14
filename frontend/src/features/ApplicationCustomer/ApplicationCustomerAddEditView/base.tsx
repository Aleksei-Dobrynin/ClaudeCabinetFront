import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type ApplicationCustomerTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseApplicationCustomerView: FC<ApplicationCustomerTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ApplicationCustomerForm" id="ApplicationCustomerForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="ApplicationCustomer_TitleName">
                  {translate('label:ApplicationCustomerAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.director}
                      onChange={(event) => store.handleChange(event)}
                      name="director"
                      data-testid="id_f_ApplicationCustomer_director"
                      id='id_f_ApplicationCustomer_director'
                      label={translate('label:ApplicationCustomerAddEditView.director')}
                      helperText={store.errors.director}
                      error={!!store.errors.director}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.okpo}
                      onChange={(event) => store.handleChange(event)}
                      name="okpo"
                      data-testid="id_f_ApplicationCustomer_okpo"
                      id='id_f_ApplicationCustomer_okpo'
                      label={translate('label:ApplicationCustomerAddEditView.okpo')}
                      helperText={store.errors.okpo}
                      error={!!store.errors.okpo}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.paymentAccount}
                      onChange={(event) => store.handleChange(event)}
                      name="paymentAccount"
                      data-testid="id_f_ApplicationCustomer_paymentAccount"
                      id='id_f_ApplicationCustomer_paymentAccount'
                      label={translate('label:ApplicationCustomerAddEditView.paymentAccount')}
                      helperText={store.errors.paymentAccount}
                      error={!!store.errors.paymentAccount}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.postalCode}
                      onChange={(event) => store.handleChange(event)}
                      name="postalCode"
                      data-testid="id_f_ApplicationCustomer_postalCode"
                      id='id_f_ApplicationCustomer_postalCode'
                      label={translate('label:ApplicationCustomerAddEditView.postalCode')}
                      helperText={store.errors.postalCode}
                      error={!!store.errors.postalCode}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.ugns}
                      onChange={(event) => store.handleChange(event)}
                      name="ugns"
                      data-testid="id_f_ApplicationCustomer_ugns"
                      id='id_f_ApplicationCustomer_ugns'
                      label={translate('label:ApplicationCustomerAddEditView.ugns')}
                      helperText={store.errors.ugns}
                      error={!!store.errors.ugns}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bank}
                      onChange={(event) => store.handleChange(event)}
                      name="bank"
                      data-testid="id_f_ApplicationCustomer_bank"
                      id='id_f_ApplicationCustomer_bank'
                      label={translate('label:ApplicationCustomerAddEditView.bank')}
                      helperText={store.errors.bank}
                      error={!!store.errors.bank}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bik}
                      onChange={(event) => store.handleChange(event)}
                      name="bik"
                      data-testid="id_f_ApplicationCustomer_bik"
                      id='id_f_ApplicationCustomer_bik'
                      label={translate('label:ApplicationCustomerAddEditView.bik')}
                      helperText={store.errors.bik}
                      error={!!store.errors.bik}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.registrationNumber}
                      onChange={(event) => store.handleChange(event)}
                      name="registrationNumber"
                      data-testid="id_f_ApplicationCustomer_registrationNumber"
                      id='id_f_ApplicationCustomer_registrationNumber'
                      label={translate('label:ApplicationCustomerAddEditView.registrationNumber')}
                      helperText={store.errors.registrationNumber}
                      error={!!store.errors.registrationNumber}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.identityDocumentTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="identityDocumentTypeId"
                      data-testid="id_f_ApplicationCustomer_identityDocumentTypeId"
                      id='id_f_ApplicationCustomer_identityDocumentTypeId'
                      label={translate('label:ApplicationCustomerAddEditView.identityDocumentTypeId')}
                      helperText={store.errors.identityDocumentTypeId}
                      error={!!store.errors.identityDocumentTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.organizationTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="organizationTypeId"
                      data={store.organizationTypes}
                      id='id_f_ApplicationCustomer_organizationTypeId'
                      label={translate('label:ApplicationCustomerAddEditView.organizationTypeId')}
                      helperText={store.errors.organizationTypeId}
                      error={!!store.errors.organizationTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_ApplicationCustomer_pin"
                      id='id_f_ApplicationCustomer_pin'
                      label={translate('label:ApplicationCustomerAddEditView.pin')}
                      helperText={store.errors.pin}
                      error={!!store.errors.pin}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.isOrganization}
                      onChange={(event) => store.handleChange(event)}
                      name="isOrganization"
                      label={translate('label:ApplicationCustomerAddEditView.isOrganization')}
                      id='id_f_ApplicationCustomer_isOrganization'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.fullName}
                      onChange={(event) => store.handleChange(event)}
                      name="fullName"
                      data-testid="id_f_ApplicationCustomer_fullName"
                      id='id_f_ApplicationCustomer_fullName'
                      label={translate('label:ApplicationCustomerAddEditView.fullName')}
                      helperText={store.errors.fullName}
                      error={!!store.errors.fullName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_ApplicationCustomer_address"
                      id='id_f_ApplicationCustomer_address'
                      label={translate('label:ApplicationCustomerAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
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

export default BaseApplicationCustomerView;

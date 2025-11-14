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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import CustomButton from "../../../components/Button";
import MainStore from "MainStore";

type PayerTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BasePayerView: FC<PayerTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="PayerForm" id="PayerForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <Box display={"flex"} justifyContent={"space-between"}>
                  <span id="Customer_TitleName">
                    {translate('label:PayerAddEditView.entityTitle')}
                  </span>
                  {(store.id === 0 && MainStore.currentUser?.companyId) ? <CustomButton onClick={() => store.setMyCompany(MainStore.currentUser?.companyId)}>
                    {translate('label:PayerAddEditView.imThePayer')}
                  </CustomButton> : <></>}
                </Box>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.lastName}
                      onChange={(event) => store.handleChange(event)}
                      name="lastName"
                      data-testid="id_f_Payer_lastName"
                      id='id_f_Payer_lastName'
                      label={translate('label:PayerAddEditView.lastName')}
                      helperText={store.errors.lastName}
                      error={!!store.errors.lastName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.firstName}
                      onChange={(event) => store.handleChange(event)}
                      name="firstName"
                      data-testid="id_f_Payer_firstName"
                      id='id_f_Payer_firstName'
                      label={translate('label:PayerAddEditView.firstName')}
                      helperText={store.errors.firstName}
                      error={!!store.errors.firstName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.secondName}
                      onChange={(event) => store.handleChange(event)}
                      name="secondName"
                      data-testid="id_f_Payer_secondName"
                      id='id_f_Payer_secondName'
                      label={translate('label:PayerAddEditView.secondName')}
                      helperText={store.errors.secondName}
                      error={!!store.errors.secondName}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.okpo}
                      onChange={(event) => store.handleChange(event)}
                      name="okpo"
                      data-testid="id_f_Payer_okpo"
                      id='id_f_Payer_okpo'
                      label={translate('label:PayerAddEditView.okpo')}
                      helperText={store.errors.okpo}
                      error={!!store.errors.okpo}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.postalCode}
                      onChange={(event) => store.handleChange(event)}
                      name="postalCode"
                      data-testid="id_f_Payer_postalCode"
                      id='id_f_Payer_postalCode'
                      label={translate('label:PayerAddEditView.postalCode')}
                      helperText={store.errors.postalCode}
                      error={!!store.errors.postalCode}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.ugns}
                      onChange={(event) => store.handleChange(event)}
                      name="ugns"
                      data-testid="id_f_Payer_ugns"
                      id='id_f_Payer_ugns'
                      label={translate('label:PayerAddEditView.ugns')}
                      helperText={store.errors.ugns}
                      error={!!store.errors.ugns}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.regNumber}
                      onChange={(event) => store.handleChange(event)}
                      name="regNumber"
                      data-testid="id_f_Payer_regNumber"
                      id='id_f_Payer_regNumber'
                      label={translate('label:PayerAddEditView.regNumber')}
                      helperText={store.errors.regNumber}
                      error={!!store.errors.regNumber}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.typeOrganizationId}
                      onChange={(event) => store.handleChange(event)}
                      name="typeOrganizationId"
                      data={store.organizationTypes}
                      id='id_f_Payer_typeOrganizationId'
                      label={translate('label:PayerAddEditView.typeOrganizationId')}
                      helperText={store.errors.typeOrganizationId}
                      error={!!store.errors.typeOrganizationId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.fullName}
                      onChange={(event) => store.handleChange(event)}
                      name="fullName"
                      data-testid="id_f_Payer_fullName"
                      id='id_f_Payer_fullName'
                      label={translate('label:PayerAddEditView.fullName')}
                      helperText={store.errors.fullName}
                      error={!!store.errors.fullName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_Payer_address"
                      id='id_f_Payer_address'
                      label={translate('label:PayerAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.director}
                      onChange={(event) => store.handleChange(event)}
                      name="director"
                      data-testid="id_f_Payer_director"
                      id='id_f_Payer_director'
                      label={translate('label:PayerAddEditView.director')}
                      helperText={store.errors.director}
                      error={!!store.errors.director}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_Payer_pin"
                      id='id_f_Payer_pin'
                      label={translate('label:PayerAddEditView.pin')}
                      helperText={store.errors.pin}
                      error={!!store.errors.pin}
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

export default BasePayerView;
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
import CustomButton from "components/Button";
import MainStore from "MainStore";
import MaskedTextField from "components/MaskedTextField";

type ApplicationPayerTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseApplicationPayerView: FC<ApplicationPayerTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ApplicationPayerForm" id="ApplicationPayerForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <Box display={"flex"} justifyContent={"space-between"}>
                  <span id="Customer_TitleName">
                    {translate('label:ApplicationPayerAddEditView.entityTitle')}
                  </span>
                  {(store.id === 0 && MainStore.currentUser?.companyId) ? <CustomButton onClick={() => store.setMyCompany(MainStore.currentUser?.companyId)}>
                    {translate('label:ApplicationPayerAddEditView.imTheCustomer')}
                  </CustomButton> : <></>}
                </Box>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.lastName}
                      onChange={(event) => store.handleChange(event)}
                      name="lastName"
                      data-testid="id_f_ApplicationPayer_lastName"
                      id='id_f_ApplicationPayer_lastName'
                      label={translate('label:ApplicationPayerAddEditView.lastName')}
                      helperText={store.errors.lastName}
                      error={!!store.errors.lastName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.firstName}
                      onChange={(event) => store.handleChange(event)}
                      name="firstName"
                      data-testid="id_f_ApplicationPayer_firstName"
                      id='id_f_ApplicationPayer_firstName'
                      label={translate('label:ApplicationPayerAddEditView.firstName')}
                      helperText={store.errors.firstName}
                      error={!!store.errors.firstName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.secondName}
                      onChange={(event) => store.handleChange(event)}
                      name="secondName"
                      data-testid="id_f_ApplicationPayer_secondName"
                      id='id_f_ApplicationPayer_secondName'
                      label={translate('label:ApplicationPayerAddEditView.secondName')}
                      helperText={store.errors.secondName}
                      error={!!store.errors.secondName}
                    />
                  </Grid> */}
                  <Grid item md={5} xs={11}>
                    <MaskedTextField
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_ApplicationPayer_pin"
                      id='id_f_ApplicationPayer_pin'
                      label={translate('label:ApplicationPayerAddEditView.pin')}
                      helperText={store.errors.pin}
                      error={!!store.errors.pin}
                      mask={"00000000000000"}
                    />
                  </Grid>
                  {!store.isPhysical &&
                    <Grid item md={12} xs={12}>
                      <LookUp
                        value={store.typeOrganizationId}
                        onChange={(event) => store.handleChange(event)}
                        name="typeOrganizationId"
                        data={store.organizationTypes}
                        id='id_f_ApplicationPayer_typeOrganizationId'
                        label={translate('label:ApplicationPayerAddEditView.typeOrganizationId')}
                        helperText={store.errors.typeOrganizationId}
                        error={!!store.errors.typeOrganizationId}
                      />
                    </Grid>
                  }
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.fullName}
                      onChange={(event) => store.handleChange(event)}
                      name="fullName"
                      data-testid="id_f_ApplicationPayer_fullName"
                      id='id_f_ApplicationPayer_fullName'
                      label={translate('label:ApplicationPayerAddEditView.fullName')}
                      helperText={store.errors.fullName}
                      error={!!store.errors.fullName}
                    />
                  </Grid>
                  {!store.isPhysical &&
                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.okpo}
                        onChange={(event) => store.handleChange(event)}
                        name="okpo"
                        data-testid="id_f_ApplicationPayer_okpo"
                        id='id_f_ApplicationPayer_okpo'
                        label={translate('label:ApplicationPayerAddEditView.okpo')}
                        helperText={store.errors.okpo}
                        error={!!store.errors.okpo}
                      />
                    </Grid>
                  }
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.account_number}
                      onChange={(event) => store.handleChange(event)}
                      name="account_number"
                      data-testid="id_f_ApplicationPayer_account_number"
                      id='id_f_ApplicationPayer_account_number'
                      label={translate('label:ApplicationPayerAddEditView.account_number')}
                      helperText={store.errors.account_number}
                      error={!!store.errors.account_number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bik}
                      onChange={(event) => store.handleChange(event)}
                      name="bik"
                      data-testid="id_f_ApplicationPayer_bik"
                      id='id_f_ApplicationPayer_bik'
                      label={translate('label:ApplicationPayerAddEditView.bik')}
                      helperText={store.errors.bik}
                      error={!!store.errors.bik}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bank_name}
                      onChange={(event) => store.handleChange(event)}
                      name="bank_name"
                      data-testid="id_f_ApplicationPayer_bank_name"
                      id='id_f_ApplicationPayer_bank_name'
                      label={translate('label:ApplicationPayerAddEditView.bank_name')}
                      helperText={store.errors.bank_name}
                      error={!!store.errors.bank_name}
                    />
                  </Grid>
                  {!store.isPhysical &&
                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.ugns}
                        onChange={(event) => store.handleChange(event)}
                        name="ugns"
                        data-testid="id_f_ApplicationPayer_ugns"
                        id='id_f_ApplicationPayer_ugns'
                        label={translate('label:ApplicationPayerAddEditView.ugns')}
                        helperText={store.errors.ugns}
                        error={!!store.errors.ugns}
                      />
                    </Grid>
                  }
                  {!store.isPhysical &&
                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.regNumber}
                        onChange={(event) => store.handleChange(event)}
                        name="regNumber"
                        data-testid="id_f_ApplicationPayer_regNumber"
                        id='id_f_ApplicationPayer_regNumber'
                        label={translate('label:ApplicationPayerAddEditView.regNumber')}
                        helperText={store.errors.regNumber}
                        error={!!store.errors.regNumber}
                      />
                    </Grid>
                  }
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_ApplicationPayer_address"
                      id='id_f_ApplicationPayer_address'
                      label={translate('label:ApplicationPayerAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
                  {!store.isPhysical &&
                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.director}
                        onChange={(event) => store.handleChange(event)}
                        name="director"
                        data-testid="id_f_ApplicationPayer_director"
                        id='id_f_ApplicationPayer_director'
                        label={translate('label:ApplicationPayerAddEditView.director')}
                        helperText={store.errors.director}
                        error={!!store.errors.director}
                      />
                    </Grid>
                  }
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

export default BaseApplicationPayerView;
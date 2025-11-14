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

type CustomerRequisiteTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseCustomerRequisiteView: FC<CustomerRequisiteTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="CustomerRequisiteForm" id="CustomerRequisiteForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="CustomerRequisite_TitleName">
                  {translate('label:CustomerRequisiteAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.paymentAccount}
                      onChange={(event) => store.handleChange(event)}
                      name="paymentAccount"
                      data-testid="id_f_CustomerRequisite_paymentAccount"
                      id='id_f_CustomerRequisite_paymentAccount'
                      label={translate('label:CustomerRequisiteAddEditView.paymentAccount')}
                      helperText={store.errors.paymentAccount}
                      error={!!store.errors.paymentAccount}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bank}
                      onChange={(event) => store.handleChange(event)}
                      name="bank"
                      data-testid="id_f_CustomerRequisite_bank"
                      id='id_f_CustomerRequisite_bank'
                      label={translate('label:CustomerRequisiteAddEditView.bank')}
                      helperText={store.errors.bank}
                      error={!!store.errors.bank}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bik}
                      onChange={(event) => store.handleChange(event)}
                      name="bik"
                      data-testid="id_f_CustomerRequisite_bik"
                      id='id_f_CustomerRequisite_bik'
                      label={translate('label:CustomerRequisiteAddEditView.bik')}
                      helperText={store.errors.bik}
                      error={!!store.errors.bik}
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

export default BaseCustomerRequisiteView;

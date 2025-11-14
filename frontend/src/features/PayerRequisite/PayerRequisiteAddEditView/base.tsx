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

type PayerRequisiteTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BasePayerRequisiteView: FC<PayerRequisiteTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="PayerRequisiteForm" id="PayerRequisiteForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="PayerRequisite_TitleName">
                  {translate('label:PayerRequisiteAddEditView.entityTitle')}
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
                      data-testid="id_f_PayerRequisite_paymentAccount"
                      id='id_f_PayerRequisite_paymentAccount'
                      label={translate('label:PayerRequisiteAddEditView.paymentAccount')}
                      helperText={store.errors.paymentAccount}
                      error={!!store.errors.paymentAccount}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bank}
                      onChange={(event) => store.handleChange(event)}
                      name="bank"
                      data-testid="id_f_PayerRequisite_bank"
                      id='id_f_PayerRequisite_bank'
                      label={translate('label:PayerRequisiteAddEditView.bank')}
                      helperText={store.errors.bank}
                      error={!!store.errors.bank}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bik}
                      onChange={(event) => store.handleChange(event)}
                      name="bik"
                      data-testid="id_f_PayerRequisite_bik"
                      id='id_f_PayerRequisite_bik'
                      label={translate('label:PayerRequisiteAddEditView.bik')}
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

export default BasePayerRequisiteView;

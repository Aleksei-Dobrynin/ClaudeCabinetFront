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

type ApplicationPaidInvoiceTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseApplicationPaidInvoiceView: FC<ApplicationPaidInvoiceTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ApplicationPaidInvoiceForm" id="ApplicationPaidInvoiceForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="ApplicationPaidInvoice_TitleName">
                  {translate('label:ApplicationPaidInvoiceAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.customerId}
                      onChange={(event) => store.handleChange(event)}
                      name="customerId"
                      data={store.customers}
                      id='id_f_ApplicationPaidInvoice_customerId'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.customerId')}
                      helperText={store.errors.customerId}
                      error={!!store.errors.customerId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date}
                      onChange={(event) => store.handleChange(event)}
                      name="date"
                      id='id_f_ApplicationPaidInvoice_date'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.date')}
                      helperText={store.errors.date}
                      error={!!store.errors.date}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.paymentIdentifier}
                      onChange={(event) => store.handleChange(event)}
                      name="paymentIdentifier"
                      data-testid="id_f_ApplicationPaidInvoice_paymentIdentifier"
                      id='id_f_ApplicationPaidInvoice_paymentIdentifier'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.paymentIdentifier')}
                      helperText={store.errors.paymentIdentifier}
                      error={!!store.errors.paymentIdentifier}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.sum}
                      onChange={(event) => store.handleChange(event)}
                      name="sum"
                      data-testid="id_f_ApplicationPaidInvoice_sum"
                      id='id_f_ApplicationPaidInvoice_sum'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.sum')}
                      helperText={store.errors.sum}
                      error={!!store.errors.sum}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_ApplicationPaidInvoice_description"
                      id='id_f_ApplicationPaidInvoice_description'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.additional}
                      onChange={(event) => store.handleChange(event)}
                      name="additional"
                      data-testid="id_f_ApplicationPaidInvoice_additional"
                      id='id_f_ApplicationPaidInvoice_additional'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.additional')}
                      helperText={store.errors.additional}
                      error={!!store.errors.additional}
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

export default BaseApplicationPaidInvoiceView;

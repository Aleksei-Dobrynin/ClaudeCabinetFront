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

type CustomerContactTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseCustomerContactView: FC<CustomerContactTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="CustomerContactForm" id="CustomerContactForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="CustomerContact_TitleName">
                  {translate('label:CustomerContactAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      data-testid="id_f_CustomerContact_value"
                      id='id_f_CustomerContact_value'
                      label={translate('label:CustomerContactAddEditView.value')}
                      helperText={store.errors.value}
                      error={!!store.errors.value}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.allowNotification}
                      onChange={(event) => store.handleChange(event)}
                      name="allowNotification"
                      label={translate('label:CustomerContactAddEditView.allowNotification')}
                      id='id_f_CustomerContact_allowNotification'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="rTypeId"
                      data-testid="id_f_CustomerContact_rTypeId"
                      id='id_f_CustomerContact_rTypeId'
                      label={translate('label:CustomerContactAddEditView.rTypeId')}
                      helperText={store.errors.rTypeId}
                      error={!!store.errors.rTypeId}
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

export default BaseCustomerContactView;

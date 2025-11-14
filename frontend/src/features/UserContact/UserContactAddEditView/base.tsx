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

type UserContactTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseUserContactView: FC<UserContactTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="UserContactForm" id="UserContactForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="UserContact_TitleName">
                  {translate('label:UserContactAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="rTypeId"
                      data-testid="id_f_UserContact_rTypeId"
                      id='id_f_UserContact_rTypeId'
                      label={translate('label:UserContactAddEditView.rTypeId')}
                      helperText={store.errors.rTypeId}
                      error={!!store.errors.rTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rTypeName}
                      onChange={(event) => store.handleChange(event)}
                      name="rTypeName"
                      data-testid="id_f_UserContact_rTypeName"
                      id='id_f_UserContact_rTypeName'
                      label={translate('label:UserContactAddEditView.rTypeName')}
                      helperText={store.errors.rTypeName}
                      error={!!store.errors.rTypeName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      data-testid="id_f_UserContact_value"
                      id='id_f_UserContact_value'
                      label={translate('label:UserContactAddEditView.value')}
                      helperText={store.errors.value}
                      error={!!store.errors.value}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.allowNotification}
                      onChange={(event) => store.handleChange(event)}
                      name="allowNotification"
                      label={translate('label:UserContactAddEditView.allowNotification')}
                      id='id_f_UserContact_allowNotification'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.customerId}
                      onChange={(event) => store.handleChange(event)}
                      name="customerId"
                      data-testid="id_f_UserContact_customerId"
                      id='id_f_UserContact_customerId'
                      label={translate('label:UserContactAddEditView.customerId')}
                      helperText={store.errors.customerId}
                      error={!!store.errors.customerId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.userId}
                      onChange={(event) => store.handleChange(event)}
                      name="userId"
                      data={store.users}
                      id='id_f_UserContact_userId'
                      label={translate('label:UserContactAddEditView.userId')}
                      helperText={store.errors.userId}
                      error={!!store.errors.userId}
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

export default BaseUserContactView;
